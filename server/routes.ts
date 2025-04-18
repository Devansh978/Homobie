import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import {
  insertLoanApplicationSchema,
  insertConsultationSchema,
  insertSipInvestmentSchema,
  insertKycDocumentSchema
} from "@shared/schema";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated() && req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
};

// Middleware to check if user is super admin
const isSuperAdmin = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated() && req.user && req.user.role === "superadmin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Initialize superadmin
  app.post("/api/init-superadmin", async (req, res, next) => {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByEmail("devanshchourey@gmail.com");
      
      if (existingUser) {
        // If exists but not superadmin, update role
        if (existingUser.role !== "superadmin") {
          const updatedUser = await storage.updateUserRole(existingUser.id, "superadmin");
          return res.status(200).json({ message: "User role updated to superadmin", user: updatedUser });
        }
        return res.status(200).json({ message: "Superadmin already exists", user: existingUser });
      }
      
      // Otherwise create a new superadmin
      const superAdmin = await storage.createUser({
        username: "devanshchourey",
        email: "devanshchourey@gmail.com",
        password: "123456", // This will be hashed in storage.createUser
        fullName: "Devansh Chourey",
        role: "superadmin",
        phoneNumber: "1234567890" // Placeholder
      });
      
      res.status(201).json({ message: "Superadmin created successfully", user: superAdmin });
    } catch (error) {
      next(error);
    }
  });

  // Loan Applications
  app.post("/api/loan-applications", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertLoanApplicationSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      const loanApplication = await storage.createLoanApplication(validatedData);
      res.status(201).json(loanApplication);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/loan-applications", isAuthenticated, async (req, res, next) => {
    try {
      const applications = await storage.getLoanApplicationsByUserId(req.user.id);
      res.json(applications);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/loan-applications/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.getLoanApplication(id);
      
      if (!application) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      
      // Check if the user is authorized to view this application
      if (application.userId !== req.user.id && req.user.role !== "admin" && req.user.role !== "superadmin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(application);
    } catch (error) {
      next(error);
    }
  });

  // Admin - Loan Application Management
  app.get("/api/admin/loan-applications", isAdmin, async (req, res, next) => {
    try {
      const applications = await storage.getAllLoanApplications();
      res.json(applications);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/admin/loan-applications/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedApplication = await storage.updateLoanApplicationStatus(id, status);
      
      if (!updatedApplication) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      
      res.json(updatedApplication);
    } catch (error) {
      next(error);
    }
  });

  // Consultations
  app.post("/api/consultations", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertConsultationSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      const consultation = await storage.createConsultation(validatedData);
      res.status(201).json(consultation);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/consultations", isAuthenticated, async (req, res, next) => {
    try {
      const consultations = await storage.getConsultationsByUserId(req.user.id);
      res.json(consultations);
    } catch (error) {
      next(error);
    }
  });

  // SIP Investments
  app.post("/api/sip-investments", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertSipInvestmentSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      const sipInvestment = await storage.createSipInvestment(validatedData);
      res.status(201).json(sipInvestment);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/sip-investments", isAuthenticated, async (req, res, next) => {
    try {
      const sipInvestments = await storage.getSipInvestmentsByUserId(req.user.id);
      res.json(sipInvestments);
    } catch (error) {
      next(error);
    }
  });

  // KYC Documents
  app.post("/api/kyc-documents", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertKycDocumentSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      const kycDocument = await storage.createKycDocument(validatedData);
      res.status(201).json(kycDocument);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/kyc-documents", isAuthenticated, async (req, res, next) => {
    try {
      const kycDocuments = await storage.getKycDocumentsByUserId(req.user.id);
      res.json(kycDocuments);
    } catch (error) {
      next(error);
    }
  });

  // Admin - User Management
  app.get("/api/admin/users", isAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  });

  // Super Admin - Role Management
  app.patch("/api/admin/users/:id/role", isSuperAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const { role } = req.body;
      
      if (!["user", "admin", "superadmin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      const updatedUser = await storage.updateUserRole(id, role);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  });

  // Transactions
  app.get("/api/transactions", isAuthenticated, async (req, res, next) => {
    try {
      const transactions = await storage.getTransactionsByUserId(req.user.id);
      res.json(transactions);
    } catch (error) {
      next(error);
    }
  });

  // Admin Analytics (simplified)
  app.get("/api/admin/analytics", isAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      const applications = await storage.getAllLoanApplications();
      const consultations = await storage.getAllConsultations();
      const sipInvestments = await storage.getAllSipInvestments();
      
      const analytics = {
        totalUsers: users.length,
        loanStats: {
          total: applications.length,
          pending: applications.filter(app => app.status === "pending").length,
          approved: applications.filter(app => app.status === "approved").length,
          rejected: applications.filter(app => app.status === "rejected").length,
        },
        consultations: {
          total: consultations.length,
          scheduled: consultations.filter(c => c.status === "scheduled").length,
          completed: consultations.filter(c => c.status === "completed").length,
        },
        sipInvestments: {
          total: sipInvestments.length,
          active: sipInvestments.filter(sip => sip.status === "active").length,
        }
      };
      
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
