import { 
  User, InsertUser, 
  LoanApplication, InsertLoanApplication,
  Consultation, InsertConsultation,
  SipInvestment, InsertSipInvestment,
  KycDocument, InsertKycDocument,
  Transaction, InsertTransaction,
  Payment, InsertPayment,
  AuditLog, InsertAuditLog,
  users, loanApplications, consultations, sipInvestments, kycDocuments, transactions, payments, auditLogs
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db } from "./db";
import { eq, desc, count } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Helper function to retry database operations with exponential backoff
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      console.error(`Database operation failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
      lastError = error;
      
      // Check if this is a connection-related error that we should retry
      const isRetryableError = 
        error.code === '57P01' || // Terminating connection due to admin command
        error.code === '08006' || // Connection failure
        error.code === '08001' || // Unable to establish connection
        error.code === '08004' || // Rejected connection
        error.code === '08007';   // Transaction resolution unknown
      
      if (!isRetryableError || attempt === maxRetries) {
        throw error; // Either not retryable or we've exhausted our retries
      }
      
      // Calculate exponential backoff delay with jitter
      const baseDelay = 100; // Start with 100ms delay
      const maxDelay = 3000; // Max delay of 3 seconds
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      const jitter = delay * 0.2 * Math.random(); // Add up to 20% jitter
      
      // Wait before the next retry
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
  
  // This should never be reached due to the loop structure, but TypeScript needs it
  throw lastError || new Error('Unknown error during database operation retry');
}

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: number, role: string): Promise<User | undefined>;

  // Loan applications
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  getLoanApplication(id: number): Promise<LoanApplication | undefined>;
  getLoanApplicationsByUserId(userId: number): Promise<LoanApplication[]>;
  getAllLoanApplications(): Promise<LoanApplication[]>;
  updateLoanApplicationStatus(id: number, status: string): Promise<LoanApplication | undefined>;

  // Consultations
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  getConsultation(id: number): Promise<Consultation | undefined>;
  getConsultationsByUserId(userId: number): Promise<Consultation[]>;
  getAllConsultations(): Promise<Consultation[]>;
  updateConsultationStatus(id: number, status: string): Promise<Consultation | undefined>;

  // SIP Investments
  createSipInvestment(investment: InsertSipInvestment): Promise<SipInvestment>;
  getSipInvestmentsByUserId(userId: number): Promise<SipInvestment[]>;
  getAllSipInvestments(): Promise<SipInvestment[]>;

  // KYC Documents
  createKycDocument(document: InsertKycDocument): Promise<KycDocument>;
  getKycDocumentsByUserId(userId: number): Promise<KycDocument[]>;
  updateKycDocumentStatus(id: number, status: string): Promise<KycDocument | undefined>;

  // Transactions
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;

  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentByOrderId(orderId: string): Promise<Payment | undefined>;
  getPaymentsByUserId(userId: number): Promise<Payment[]>;
  updatePaymentStatus(id: number, status: string, paymentId?: string, signature?: string): Promise<Payment | undefined>;

  // Audit Logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogsByUserId(userId: number): Promise<AuditLog[]>;
  getAuditLogsByEntityType(entityType: string): Promise<AuditLog[]>;
  getAuditLogs(limit?: number, offset?: number): Promise<AuditLog[]>;
  getAuditLogsByAdmin(adminId: number, limit?: number, offset?: number): Promise<AuditLog[]>;
  getAuditLogsCount(): Promise<number>;

  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    // Initialize session store with retry capability
    try {
      this.sessionStore = new PostgresSessionStore({ 
        pool,
        createTableIfMissing: true
      });
    } catch (error) {
      console.error('Failed to initialize PostgreSQL session store:', error);
      console.log('Falling back to memory session store');
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000 // Prune expired entries every 24h
      });
    }

    // Create a superadmin user for testing if none exists - wrapped in retry logic
    (async () => {
      try {
        const user = await this.getUserByUsername("admin");
        if (!user) {
          const newUser = await this.createUser({
            username: "admin",
            password: "password123", // In a real app, this would be hashed
            email: "admin@finsecure.com",
            fullName: "Admin User",
            phoneNumber: "1234567890"
          });
          await this.updateUserRole(newUser.id, "superadmin");
        }
      } catch (error) {
        console.error('Failed to create admin user:', error);
      }
    })();
  }

  // User Management
  async getUser(id: number): Promise<User | undefined> {
    return withRetry(async () => {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    });
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return withRetry(async () => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      return user;
    });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return withRetry(async () => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      return user;
    });
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return withRetry(async () => {
      const [user] = await db
        .insert(users)
        .values({
          ...insertUser,
          role: "user"
        })
        .returning();
      return user;
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    return withRetry(async () => {
      const [updatedUser] = await db
        .update(users)
        .set({ role })
        .where(eq(users.id, id))
        .returning();
      return updatedUser;
    });
  }

  // Loan Applications
  async createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication> {
    return withRetry(async () => {
      const [loanApplication] = await db
        .insert(loanApplications)
        .values({
          ...application,
          status: "pending"
        })
        .returning();
      return loanApplication;
    });
  }

  async getLoanApplication(id: number): Promise<LoanApplication | undefined> {
    return withRetry(async () => {
      const [loanApplication] = await db
        .select()
        .from(loanApplications)
        .where(eq(loanApplications.id, id));
      return loanApplication;
    });
  }

  async getLoanApplicationsByUserId(userId: number): Promise<LoanApplication[]> {
    return await db
      .select()
      .from(loanApplications)
      .where(eq(loanApplications.userId, userId));
  }

  async getAllLoanApplications(): Promise<LoanApplication[]> {
    return await db.select().from(loanApplications);
  }

  async updateLoanApplicationStatus(id: number, status: string): Promise<LoanApplication | undefined> {
    const [updatedApplication] = await db
      .update(loanApplications)
      .set({ status, updatedAt: new Date() })
      .where(eq(loanApplications.id, id))
      .returning();
    return updatedApplication;
  }

  // Consultations
  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const [newConsultation] = await db
      .insert(consultations)
      .values({
        ...consultation,
        status: "scheduled"
      })
      .returning();
    return newConsultation;
  }
  
  async getConsultation(id: number): Promise<Consultation | undefined> {
    const [consultation] = await db
      .select()
      .from(consultations)
      .where(eq(consultations.id, id));
    return consultation;
  }

  async getConsultationsByUserId(userId: number): Promise<Consultation[]> {
    return await db
      .select()
      .from(consultations)
      .where(eq(consultations.userId, userId));
  }

  async getAllConsultations(): Promise<Consultation[]> {
    return await db.select().from(consultations);
  }

  async updateConsultationStatus(id: number, status: string): Promise<Consultation | undefined> {
    const [updatedConsultation] = await db
      .update(consultations)
      .set({ status })
      .where(eq(consultations.id, id))
      .returning();
    return updatedConsultation;
  }

  // SIP Investments
  async createSipInvestment(investment: InsertSipInvestment): Promise<SipInvestment> {
    const [newInvestment] = await db
      .insert(sipInvestments)
      .values({
        ...investment,
        status: "active"
      })
      .returning();
    return newInvestment;
  }

  async getSipInvestmentsByUserId(userId: number): Promise<SipInvestment[]> {
    return await db
      .select()
      .from(sipInvestments)
      .where(eq(sipInvestments.userId, userId));
  }

  async getAllSipInvestments(): Promise<SipInvestment[]> {
    return await db.select().from(sipInvestments);
  }

  // KYC Documents
  async createKycDocument(document: InsertKycDocument): Promise<KycDocument> {
    const [newDocument] = await db
      .insert(kycDocuments)
      .values({
        ...document,
        verificationStatus: "pending"
      })
      .returning();
    return newDocument;
  }

  async getKycDocumentsByUserId(userId: number): Promise<KycDocument[]> {
    return await db
      .select()
      .from(kycDocuments)
      .where(eq(kycDocuments.userId, userId));
  }

  async updateKycDocumentStatus(id: number, status: string): Promise<KycDocument | undefined> {
    const [updatedDocument] = await db
      .update(kycDocuments)
      .set({ verificationStatus: status })
      .where(eq(kycDocuments.id, id))
      .returning();
    return updatedDocument;
  }

  // Transactions
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId));
  }

  // Payments
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db
      .insert(payments)
      .values({
        ...payment,
        status: payment.status || "created",
        updatedAt: new Date()
      })
      .returning();
    return newPayment;
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id));
    return payment;
  }

  async getPaymentByOrderId(orderId: string): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderId));
    return payment;
  }

  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId));
  }

  async updatePaymentStatus(id: number, status: string, paymentId?: string, signature?: string): Promise<Payment | undefined> {
    const updateData: any = { 
      status, 
      updatedAt: new Date() 
    };
    
    if (paymentId) {
      updateData.paymentId = paymentId;
    }
    
    if (signature) {
      updateData.signature = signature;
    }
    
    const [updatedPayment] = await db
      .update(payments)
      .set(updateData)
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }

  // Audit Logs
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db
      .insert(auditLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async getAuditLogsByUserId(userId: number): Promise<AuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, userId))
      .orderBy(desc(auditLogs.createdAt));
  }

  async getAuditLogsByEntityType(entityType: string): Promise<AuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.entityType, entityType))
      .orderBy(desc(auditLogs.createdAt));
  }

  async getAuditLogs(limit = 50, offset = 0): Promise<AuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getAuditLogsByAdmin(adminId: number, limit = 50, offset = 0): Promise<AuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, adminId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getAuditLogsCount(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(auditLogs);
    return result?.count || 0;
  }
}

export const storage = new DatabaseStorage();
