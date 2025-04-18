import { 
  User, InsertUser, 
  LoanApplication, InsertLoanApplication,
  Consultation, InsertConsultation,
  SipInvestment, InsertSipInvestment,
  KycDocument, InsertKycDocument,
  Transaction, InsertTransaction
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

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

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private loanApplications: Map<number, LoanApplication>;
  private consultations: Map<number, Consultation>;
  private sipInvestments: Map<number, SipInvestment>;
  private kycDocuments: Map<number, KycDocument>;
  private transactions: Map<number, Transaction>;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private loanApplicationIdCounter: number;
  private consultationIdCounter: number;
  private sipInvestmentIdCounter: number;
  private kycDocumentIdCounter: number;
  private transactionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.loanApplications = new Map();
    this.consultations = new Map();
    this.sipInvestments = new Map();
    this.kycDocuments = new Map();
    this.transactions = new Map();
    
    this.userIdCounter = 1;
    this.loanApplicationIdCounter = 1;
    this.consultationIdCounter = 1;
    this.sipInvestmentIdCounter = 1;
    this.kycDocumentIdCounter = 1;
    this.transactionIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });

    // Create a superadmin user for testing
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

  // User Management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      role: "user",
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, role };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Loan Applications
  async createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication> {
    const id = this.loanApplicationIdCounter++;
    const now = new Date();
    const loanApplication: LoanApplication = {
      ...application,
      id,
      status: "pending",
      appliedAt: now,
      updatedAt: now
    };
    this.loanApplications.set(id, loanApplication);
    return loanApplication;
  }

  async getLoanApplication(id: number): Promise<LoanApplication | undefined> {
    return this.loanApplications.get(id);
  }

  async getLoanApplicationsByUserId(userId: number): Promise<LoanApplication[]> {
    return Array.from(this.loanApplications.values()).filter(
      (application) => application.userId === userId
    );
  }

  async getAllLoanApplications(): Promise<LoanApplication[]> {
    return Array.from(this.loanApplications.values());
  }

  async updateLoanApplicationStatus(id: number, status: string): Promise<LoanApplication | undefined> {
    const application = this.loanApplications.get(id);
    if (!application) return undefined;
    
    const now = new Date();
    const updatedApplication: LoanApplication = { 
      ...application, 
      status, 
      updatedAt: now
    };
    this.loanApplications.set(id, updatedApplication);
    return updatedApplication;
  }

  // Consultations
  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const id = this.consultationIdCounter++;
    const now = new Date();
    const newConsultation: Consultation = {
      ...consultation,
      id,
      status: "scheduled",
      bookedAt: now
    };
    this.consultations.set(id, newConsultation);
    return newConsultation;
  }

  async getConsultationsByUserId(userId: number): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      (consultation) => consultation.userId === userId
    );
  }

  async getAllConsultations(): Promise<Consultation[]> {
    return Array.from(this.consultations.values());
  }

  async updateConsultationStatus(id: number, status: string): Promise<Consultation | undefined> {
    const consultation = this.consultations.get(id);
    if (!consultation) return undefined;
    
    const updatedConsultation: Consultation = { ...consultation, status };
    this.consultations.set(id, updatedConsultation);
    return updatedConsultation;
  }

  // SIP Investments
  async createSipInvestment(investment: InsertSipInvestment): Promise<SipInvestment> {
    const id = this.sipInvestmentIdCounter++;
    const now = new Date();
    const newInvestment: SipInvestment = {
      ...investment,
      id,
      status: "active",
      createdAt: now
    };
    this.sipInvestments.set(id, newInvestment);
    return newInvestment;
  }

  async getSipInvestmentsByUserId(userId: number): Promise<SipInvestment[]> {
    return Array.from(this.sipInvestments.values()).filter(
      (investment) => investment.userId === userId
    );
  }

  async getAllSipInvestments(): Promise<SipInvestment[]> {
    return Array.from(this.sipInvestments.values());
  }

  // KYC Documents
  async createKycDocument(document: InsertKycDocument): Promise<KycDocument> {
    const id = this.kycDocumentIdCounter++;
    const now = new Date();
    const newDocument: KycDocument = {
      ...document,
      id,
      verificationStatus: "pending",
      uploadedAt: now
    };
    this.kycDocuments.set(id, newDocument);
    return newDocument;
  }

  async getKycDocumentsByUserId(userId: number): Promise<KycDocument[]> {
    return Array.from(this.kycDocuments.values()).filter(
      (document) => document.userId === userId
    );
  }

  async updateKycDocumentStatus(id: number, status: string): Promise<KycDocument | undefined> {
    const document = this.kycDocuments.get(id);
    if (!document) return undefined;
    
    const updatedDocument: KycDocument = { ...document, verificationStatus: status };
    this.kycDocuments.set(id, updatedDocument);
    return updatedDocument;
  }

  // Transactions
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    const newTransaction: Transaction = {
      ...transaction,
      id,
      transactionDate: now
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId
    );
  }
}

export const storage = new MemStorage();
