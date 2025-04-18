import { pgTable, text, serial, integer, boolean, timestamp, json, varchar, date, numeric, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number"),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phoneNumber: true,
  role: true,
});

// KYC Documents schema
export const kycDocuments = pgTable("kyc_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  documentType: text("document_type").notNull(), // PAN, Aadhaar, SalarySlip
  documentUrl: text("document_url").notNull(),
  verificationStatus: text("verification_status").default("pending").notNull(), // pending, verified, rejected
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const insertKycDocumentSchema = createInsertSchema(kycDocuments).pick({
  userId: true,
  documentType: true,
  documentUrl: true,
});

// Loan Applications schema
export const loanApplications = pgTable("loan_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  loanType: text("loan_type").notNull(), // HomeLoan, LAP, BTTopUp
  amount: numeric("amount").notNull(),
  tenure: integer("tenure").notNull(), // in months
  interestRate: numeric("interest_rate").notNull(),
  status: text("status").default("pending").notNull(), // pending, approved, rejected
  purpose: text("purpose"),
  propertyValue: numeric("property_value"),
  propertyAddress: text("property_address"),
  monthlyIncome: numeric("monthly_income"),
  employmentType: text("employment_type"), // salaried, self-employed
  existingLoanDetails: json("existing_loan_details"), // for BT Top-Up
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLoanApplicationSchema = createInsertSchema(loanApplications).pick({
  userId: true,
  loanType: true,
  amount: true,
  tenure: true,
  interestRate: true,
  purpose: true,
  propertyValue: true,
  propertyAddress: true,
  monthlyIncome: true,
  employmentType: true,
  existingLoanDetails: true,
});

// SIP Investments schema
export const sipInvestments = pgTable("sip_investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planName: text("plan_name").notNull(),
  monthlyAmount: numeric("monthly_amount").notNull(),
  startDate: date("start_date").notNull(),
  durationMonths: integer("duration_months").notNull(),
  expectedReturns: numeric("expected_returns"),
  status: text("status").default("active").notNull(), // active, paused, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSipInvestmentSchema = createInsertSchema(sipInvestments).pick({
  userId: true,
  planName: true,
  monthlyAmount: true,
  startDate: true,
  durationMonths: true,
  expectedReturns: true,
});

// Consultations schema
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  topic: text("topic").notNull(),
  preferredDate: date("preferred_date").notNull(),
  status: text("status").default("scheduled").notNull(), // scheduled, completed, cancelled
  notes: text("notes"),
  bookedAt: timestamp("booked_at").defaultNow().notNull(),
});

export const insertConsultationSchema = createInsertSchema(consultations).pick({
  userId: true,
  topic: true,
  preferredDate: true,
  notes: true,
});

// Transaction History schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  transactionType: text("transaction_type").notNull(), // loan_disbursement, emi_payment, sip_contribution
  amount: numeric("amount").notNull(),
  relatedId: integer("related_id"), // loan or sip id
  description: text("description"),
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  transactionType: true,
  amount: true,
  relatedId: true,
  description: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type KycDocument = typeof kycDocuments.$inferSelect;
export type InsertKycDocument = z.infer<typeof insertKycDocumentSchema>;

export type LoanApplication = typeof loanApplications.$inferSelect;
export type InsertLoanApplication = z.infer<typeof insertLoanApplicationSchema>;

export type SipInvestment = typeof sipInvestments.$inferSelect;
export type InsertSipInvestment = z.infer<typeof insertSipInvestmentSchema>;

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
