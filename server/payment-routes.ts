import { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { insertPaymentSchema } from "@shared/schema";
import { razorpayService, PaymentOrderOptions, PaymentVerificationData } from "./razorpay";
import { v4 as uuidv4 } from "uuid";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Register payment routes
export function registerPaymentRoutes(app: Express) {
  // Create a payment order for a loan application processing fee
  app.post("/api/payments/loan-processing-fee/:loanId", isAuthenticated, async (req, res, next) => {
    try {
      const loanId = parseInt(req.params.loanId);
      const loanApplication = await storage.getLoanApplication(loanId);
      
      if (!loanApplication) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      
      // Check if the user is authorized to create the payment
      if (loanApplication.userId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Calculate processing fee (e.g., 1% of loan amount)
      const processingFee = parseFloat(loanApplication.amount.toString()) * 0.01;
      
      // Create a Razorpay order
      const receipt = `loan-proc-${loanId}-${uuidv4().substring(0, 8)}`;
      const orderOptions: PaymentOrderOptions = {
        amount: Math.round(processingFee * 100).toString(), // Convert to paise
        currency: "INR",
        receipt,
        paymentFor: "processing_fee",
        customerId: req.user!.id,
        notes: {
          loanId: loanId.toString(),
          loanType: loanApplication.loanType,
          amount: loanApplication.amount.toString()
        }
      };
      
      const order = await razorpayService.createOrder(orderOptions);
      
      // Store the payment record in the database
      const payment = await storage.createPayment({
        userId: req.user!.id,
        amount: processingFee.toString(),
        currency: "INR",
        status: "created",
        orderId: order.id,
        paymentFor: "processing_fee",
        relatedId: loanId,
        receipt,
        notes: orderOptions.notes
      });
      
      res.status(201).json({
        ...payment,
        razorpay: {
          key: process.env.RAZORPAY_KEY_ID,
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          name: "FinSecure",
          description: `Processing Fee for ${loanApplication.loanType}`,
          prefill: {
            name: req.user!.fullName,
            email: req.user!.email,
            contact: req.user!.phoneNumber
          }
        }
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Create a payment order for SIP investment
  app.post("/api/payments/sip-investment/:sipId", isAuthenticated, async (req, res, next) => {
    try {
      const sipId = parseInt(req.params.sipId);
      const sipInvestment = await storage.getSipInvestmentsByUserId(req.user!.id)
        .then(sips => sips.find(sip => sip.id === sipId));
      
      if (!sipInvestment) {
        return res.status(404).json({ message: "SIP investment not found" });
      }
      
      // Amount to pay is the monthly SIP amount
      const amount = parseFloat(sipInvestment.monthlyAmount.toString());
      
      // Create a Razorpay order
      const receipt = `sip-${sipId}-${uuidv4().substring(0, 8)}`;
      const orderOptions: PaymentOrderOptions = {
        amount: Math.round(amount * 100).toString(), // Convert to paise
        currency: "INR",
        receipt,
        paymentFor: "sip_investment",
        customerId: req.user!.id,
        notes: {
          sipId: sipId.toString(),
          planName: sipInvestment.planName
        }
      };
      
      const order = await razorpayService.createOrder(orderOptions);
      
      // Store the payment record in the database
      const payment = await storage.createPayment({
        userId: req.user!.id,
        amount: amount.toString(),
        currency: "INR",
        status: "created",
        orderId: order.id,
        paymentFor: "sip_investment",
        relatedId: sipId,
        receipt,
        notes: orderOptions.notes
      });
      
      res.status(201).json({
        ...payment,
        razorpay: {
          key: process.env.RAZORPAY_KEY_ID,
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          name: "FinSecure",
          description: `SIP Investment for ${sipInvestment.planName}`,
          prefill: {
            name: req.user!.fullName,
            email: req.user!.email,
            contact: req.user!.phoneNumber
          }
        }
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Payment verification webhook
  app.post("/api/payments/verify", async (req, res, next) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      // Validate required fields
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: "Missing required verification parameters" });
      }
      
      // Get the payment record
      const payment = await storage.getPaymentByOrderId(razorpay_order_id);
      
      if (!payment) {
        return res.status(404).json({ message: "Payment record not found" });
      }
      
      // Verify the signature
      const verificationData: PaymentVerificationData = {
        orderCreationId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      };
      
      const isValid = razorpayService.verifyPaymentSignature(verificationData);
      
      if (!isValid) {
        // Update payment record with failed status
        await storage.updatePaymentStatus(payment.id, "failed");
        return res.status(400).json({ message: "Invalid payment signature" });
      }
      
      // Update payment record with captured status
      const updatedPayment = await storage.updatePaymentStatus(
        payment.id, 
        "captured", 
        razorpay_payment_id, 
        razorpay_signature
      );
      
      // Create a transaction record
      await storage.createTransaction({
        userId: payment.userId,
        transactionType: payment.paymentFor === "processing_fee" 
          ? "processing_fee_payment" 
          : payment.paymentFor === "sip_investment" 
            ? "sip_contribution"
            : "other_payment",
        amount: payment.amount.toString(),
        relatedId: payment.relatedId,
        description: `Payment for ${payment.paymentFor} with ID ${payment.relatedId}`
      });
      
      // Handle different types of payments
      if (payment.paymentFor === "processing_fee" && payment.relatedId) {
        // Update the loan application status
        await storage.updateLoanApplicationStatus(payment.relatedId, "processing");
      } else if (payment.paymentFor === "consultation" && payment.relatedId) {
        // Update the consultation status to scheduled
        await storage.updateConsultationStatus(payment.relatedId, "scheduled");
      }
      
      res.status(200).json({ 
        message: "Payment verified successfully", 
        status: "success",
        payment: updatedPayment
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      next(error);
    }
  });
  
  // Get payment details
  app.get("/api/payments/:id", isAuthenticated, async (req, res, next) => {
    try {
      const paymentId = parseInt(req.params.id);
      const payment = await storage.getPayment(paymentId);
      
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      // Check if the user is authorized to view this payment
      if (payment.userId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(payment);
    } catch (error) {
      next(error);
    }
  });
  
  // Create a payment order for consultation
  app.post("/api/payments/consultation/:consultationId", isAuthenticated, async (req, res, next) => {
    try {
      const consultationId = parseInt(req.params.consultationId);
      const consultation = await storage.getConsultation(consultationId);
      
      if (!consultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }
      
      // Check if the user is authorized to create the payment
      if (consultation.userId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Consultation fee - fixed at 999 INR or can be dynamic based on consultation type
      const consultationFee = 999; // In INR
      
      // Create a Razorpay order
      const receipt = `cons-${consultationId}-${uuidv4().substring(0, 8)}`;
      const orderOptions: PaymentOrderOptions = {
        amount: Math.round(consultationFee * 100).toString(), // Convert to paise
        currency: "INR",
        receipt,
        paymentFor: "consultation",
        customerId: req.user!.id,
        notes: {
          consultationId: consultationId.toString(),
          topic: consultation.topic,
          preferredDate: consultation.preferredDate
        }
      };
      
      try {
        const order = await razorpayService.createOrder(orderOptions);
        
        // Store the payment record in the database
        const payment = await storage.createPayment({
          userId: req.user!.id,
          amount: consultationFee.toString(),
          currency: "INR",
          status: "created",
          orderId: order.id,
          paymentFor: "consultation",
          relatedId: consultationId,
          receipt,
          notes: orderOptions.notes
        });
        
        res.status(201).json({
          ...payment,
          razorpay: {
            key: process.env.RAZORPAY_KEY_ID,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            name: "Homobie",
            description: `Consultation Fee for ${consultation.topic}`,
            prefill: {
              name: req.user!.fullName,
              email: req.user!.email,
              contact: req.user!.phoneNumber
            }
          }
        });
      } catch (razorpayError) {
        console.error("Razorpay order creation failed:", razorpayError);
        
        // For development/demo purposes when Razorpay is not configured
        // Create a dummy payment record to allow flow testing
        const dummyOrderId = `demo_order_${Date.now()}`;
        
        const payment = await storage.createPayment({
          userId: req.user!.id,
          amount: consultationFee.toString(),
          currency: "INR",
          status: "demo_mode",
          orderId: dummyOrderId,
          paymentFor: "consultation",
          relatedId: consultationId,
          receipt,
          notes: { ...orderOptions.notes, demo_mode: "true" }
        });
        
        // Return demo payment data
        return res.status(201).json({
          ...payment,
          demo_mode: true,
          message: "Demo mode: Payment gateway not configured. Using test flow.",
          razorpay: {
            key: "demo_key",
            order_id: dummyOrderId,
            amount: consultationFee * 100,
            currency: "INR",
            name: "Homobie",
            description: `Consultation Fee for ${consultation.topic} (Demo Mode)`,
            prefill: {
              name: req.user!.fullName,
              email: req.user!.email,
              contact: req.user!.phoneNumber
            }
          }
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  // Get all payments for the current user
  app.get("/api/payments", isAuthenticated, async (req, res, next) => {
    try {
      const payments = await storage.getPaymentsByUserId(req.user!.id);
      res.json(payments);
    } catch (error) {
      next(error);
    }
  });
}