import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay with your key credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface PaymentOrderOptions {
  amount: number;  // in smallest currency unit (paise for INR)
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
      const refundOptions: Record<string, any> = { payment_id: paymentId };
      
      if (amount) {
        refundOptions.amount = amount;
      }
      
      return await razorpay.refunds.create(refundOptions);
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  },
};