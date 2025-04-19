import { 
  User, InsertUser, 
  LoanApplication, InsertLoanApplication,
  Consultation, InsertConsultation,
  SipInvestment, InsertSipInvestment,
  KycDocument, InsertKycDocument,
  Transaction, InsertTransaction,
  Payment, InsertPayment,
  users, loanApplications, consultations, sipInvestments, kycDocuments, transactions, payments
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

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

  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true
    });

    // Create a superadmin user for testing if none exists
    this.getUserByUsername("admin").then(user => {
      if (!user) {
        this.createUser({
          username: "admin",
          password: "password123", // In a real app, this would be hashed
          email: "admin@finsecure.com",
          fullName: "Admin User",
          phoneNumber: "1234567890"
        }).then(user => {
          this.updateUserRole(user.id, "superadmin");
        });
      }
    });
  }

  // User Management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        role: "user"
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Loan Applications
  async createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication> {
    const [loanApplication] = await db
      .insert(loanApplications)
      .values({
        ...application,
        status: "pending"
      })
      .returning();
    return loanApplication;
  }

  async getLoanApplication(id: number): Promise<LoanApplication | undefined> {
    const [loanApplication] = await db
      .select()
      .from(loanApplications)
      .where(eq(loanApplications.id, id));
    return loanApplication;
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
}

export const storage = new DatabaseStorage();
