import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay with your key credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface PaymentOrderOptions {
  amount: string;  // in smallest currency unit (paise for INR) - as string to handle large numbers
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
  customerId?: number;
  paymentFor: 'loan_application' | 'sip_investment' | 'consultation' | 'processing_fee';
  metadata?: Record<string, any>;
}

export interface PaymentVerificationData {
  orderCreationId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export const razorpayService = {
  /**
   * Create a new payment order
   */
  async createOrder(options: PaymentOrderOptions) {
    try {
      // Validate API keys before making request
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay API keys are not configured properly');
      }

      console.log('Creating Razorpay order with options:', {
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        paymentFor: options.paymentFor
      });

      const order = await razorpay.orders.create({
        amount: options.amount,
        currency: options.currency || 'INR',
        receipt: options.receipt,
        notes: {
          paymentFor: options.paymentFor,
          customerId: options.customerId ? options.customerId.toString() : null,
          ...options.notes,
        },
      });
      
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at,
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      
      // Check if it's an authentication error
      if (error.statusCode === 401) {
        throw new Error('Razorpay authentication failed. Please verify your API keys are correct and active.');
      }
      
      throw error;
    }
  },

  /**
   * Verify payment signature
   */
  verifyPaymentSignature(data: PaymentVerificationData) {
    try {
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
      hmac.update(`${data.orderCreationId}|${data.razorpayPaymentId}`);
      const generatedSignature = hmac.digest('hex');
      
      return generatedSignature === data.razorpaySignature;
    } catch (error) {
      console.error('Error verifying payment signature:', error);
      throw error;
    }
  },

  /**
   * Fetch payment details by ID
   */
  async getPayment(paymentId: string) {
    try {
      return await razorpay.payments.fetch(paymentId);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  },

  /**
   * Capture an authorized payment
   */
  async capturePayment(paymentId: string, amount: number) {
    try {
      return await razorpay.payments.capture(paymentId, amount, 'INR');
    } catch (error) {
      console.error('Error capturing payment:', error);
      throw error;
    }
  },

  /**
   * Refund a payment
   */
  async refundPayment(paymentId: string, amount?: number) {
    try {
      // Type casting to avoid TypeScript errors with potentially incomplete Razorpay type definitions
      // This is safe because at runtime, the Razorpay SDK accepts this function call
      return await (razorpay as any).payments.refund(paymentId, amount ? { 
        amount: amount 
      } : undefined);
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  },
};