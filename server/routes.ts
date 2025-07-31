import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { registerPaymentRoutes } from "./payment-routes";
import { z } from "zod";
import {
  insertLoanApplicationSchema,
  insertConsultationSchema,
  insertSipInvestmentSchema,
  insertKycDocumentSchema,
  insertTransactionSchema,
  insertAuditLogSchema
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

// Utility function to create audit logs
const createAuditLog = async (req: Request, actionType: string, entityType?: string, entityId?: number, oldValue?: any, newValue?: any, description?: string) => {
  if (!req.user) return;
  
  try {
    const log = await storage.createAuditLog({
      userId: req.user.id,
      actionType,
      entityType,
      entityId,
      oldValue,
      newValue,
      description: description || `${actionType} performed on ${entityType || 'unknown entity'}${entityId ? ` #${entityId}` : ''}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    return log;
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Register payment routes
  registerPaymentRoutes(app);
  
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

  // Loan Applications//
  // Updated loan applications route with better error handling
  app.post("/api/loan-applications", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertLoanApplicationSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      const loanApplication = await storage.createLoanApplication(validatedData);

      res.status(201).json({
        success: true,
        data: loanApplication
      });

    } catch (error) {
      console.error('Loan application creation error:', error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
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
      
      // Get the original application before update
      const originalApplication = await storage.getLoanApplication(id);
      
      if (!originalApplication) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      
      const updatedApplication = await storage.updateLoanApplicationStatus(id, status);
      
      if (!updatedApplication) {
        return res.status(500).json({ message: "Failed to update loan application" });
      }
      
      // Log the status change in audit logs
      await createAuditLog(
        req, 
        "update_loan_status", 
        "loan_application", 
        id, 
        { status: originalApplication.status }, 
        { status: updatedApplication.status }, 
        `Changed Loan #${id} status from "${originalApplication.status}" to "${status}"`
      );
      
      res.json(updatedApplication);
    } catch (error) {
      next(error);
    }
  });

  // Consultations
  app.post("/api/consultations", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      
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
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const consultations = await storage.getConsultationsByUserId(req.user.id);
      res.json(consultations);
    } catch (error) {
      next(error);
    }
  });
  
  // Admin - Consultation Management
  app.get("/api/admin/consultations", isAdmin, async (req, res, next) => {
    try {
      const consultations = await storage.getAllConsultations();
      res.json(consultations);
    } catch (error) {
      next(error);
    }
  });
  
  app.patch("/api/admin/consultations/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["pending", "scheduled", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      // Get the original consultation before update
      const originalConsultation = await storage.getConsultation(id);
      
      if (!originalConsultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }
      
      const updatedConsultation = await storage.updateConsultationStatus(id, status);
      
      // Log the status change in audit logs
      await createAuditLog(
        req, 
        "update_consultation_status", 
        "consultation", 
        id, 
        { status: originalConsultation.status }, 
        { status: updatedConsultation?.status }, 
        `Changed Consultation #${id} status from "${originalConsultation.status}" to "${status}"`
      );
      
      res.json(updatedConsultation);
    } catch (error) {
      next(error);
    }
  });

  // SIP Investments
  app.post("/api/sip-investments", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      
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
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const sipInvestments = await storage.getSipInvestmentsByUserId(req.user.id);
      res.json(sipInvestments);
    } catch (error) {
      next(error);
    }
  });

  // KYC Documents
  app.post("/api/kyc-documents", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      
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
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      
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
      
      // Get the user before update
      const originalUser = await storage.getUser(id);
      
      if (!originalUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUserRole(id, role);
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user role" });
      }
      
      // Log the role change in audit logs
      await createAuditLog(
        req, 
        "update_user_role", 
        "user", 
        id, 
        { role: originalUser.role }, 
        { role: updatedUser.role }, 
        `Changed user #${id} role from "${originalUser.role}" to "${role}"`
      );
      
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  });

  // Transactions
  app.get("/api/transactions", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      
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
      const auditLogsCount = await storage.getAuditLogsCount();
      
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
        },
        auditLogs: {
          total: auditLogsCount
        }
      };
      
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  });

  // Audit Logs API
  app.get("/api/audit-logs", isAdmin, async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const logs = await storage.getAuditLogs(limit, offset);
      const count = await storage.getAuditLogsCount();
      
      res.json({
        logs,
        pagination: {
          total: count,
          limit,
          offset,
          hasMore: offset + logs.length < count
        }
      });
      
      // Log this audit log access
      await createAuditLog(req, "view_audit_logs", "audit_logs", undefined, undefined, undefined, 
        `Admin user viewed audit logs (${logs.length} entries)`);
      
    } catch (error) {
      next(error);
    }
  });
  
  // Get audit logs by entity type
  app.get("/api/audit-logs/entity/:entityType", isAdmin, async (req, res, next) => {
    try {
      const entityType = req.params.entityType;
      const logs = await storage.getAuditLogsByEntityType(entityType);
      
      res.json(logs);
      
      await createAuditLog(req, "view_entity_audit_logs", entityType, undefined, undefined, undefined, 
        `Admin user viewed ${entityType} audit logs (${logs.length} entries)`);
      
    } catch (error) {
      next(error);
    }
  });
  
  // Get admin activity logs
  app.get("/api/audit-logs/admin/:adminId", isSuperAdmin, async (req, res, next) => {
    try {
      const adminId = parseInt(req.params.adminId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const logs = await storage.getAuditLogsByAdmin(adminId, limit, offset);
      
      res.json(logs);
      
      await createAuditLog(req, "view_admin_audit_logs", "user", adminId, undefined, undefined, 
        `Super admin viewed admin user #${adminId} audit logs (${logs.length} entries)`);
      
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
