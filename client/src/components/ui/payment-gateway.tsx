import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentGatewayProps {
  paymentType: "loan-processing-fee" | "sip-investment";
  itemId: number;
  onSuccess?: (data: any) => void;
  onFailure?: (error: any) => void;
  buttonText?: string;
  description?: string;
}

export function PaymentGateway({
  paymentType,
  itemId,
  onSuccess,
  onFailure,
  buttonText = "Make Payment",
  description = "Proceed to payment gateway"
}: PaymentGatewayProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [paymentData, setPaymentData] = useState<any>(null);

  // Function to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  // Function to create payment order
  const createPaymentOrder = async () => {
    setLoading(true);
    setPaymentStatus("loading");
    
    try {
      const endpoint = `/api/payments/${paymentType}/${itemId}`;
      const response = await apiRequest("POST", endpoint);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create payment");
      }
      
      const data = await response.json();
      setPaymentData(data);
      return data;
    } catch (error: any) {
      setPaymentStatus("error");
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
      if (onFailure) onFailure(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to handle payment
  const handlePayment = async () => {
    try {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }
      
      // Create payment order
      const order = await createPaymentOrder();
      
      // Configure Razorpay options
      const options = {
        key: order.razorpay.key,
        amount: order.razorpay.amount,
        currency: order.razorpay.currency,
        name: order.razorpay.name,
        description: order.razorpay.description,
        order_id: order.razorpay.order_id,
        prefill: order.razorpay.prefill,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResult = await apiRequest("POST", "/api/payments/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            
            if (!verifyResult.ok) {
              const errorData = await verifyResult.json();
              throw new Error(errorData.message || "Payment verification failed");
            }
            
            const verificationData = await verifyResult.json();
            setPaymentStatus("success");
            
            toast({
              title: "Payment Successful",
              description: "Your payment has been processed successfully",
              variant: "default",
            });
            
            if (onSuccess) onSuccess(verificationData);
          } catch (error: any) {
            setPaymentStatus("error");
            toast({
              title: "Verification Failed",
              description: error.message || "Payment could not be verified",
              variant: "destructive",
            });
            if (onFailure) onFailure(error);
          }
        },
        modal: {
          ondismiss: function () {
            if (paymentStatus === "loading") {
              setPaymentStatus("idle");
            }
            toast({
              title: "Payment Cancelled",
              description: "You have closed the payment window",
              variant: "default",
            });
          },
        },
        theme: {
          color: "#3B82F6",
        },
      };
      
      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      // Error already handled in createPaymentOrder
      console.error("Payment initialization failed:", error);
    }
  };

  if (paymentStatus === "success") {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Check className="w-5 h-5" /> Payment Successful
          </CardTitle>
          <CardDescription>
            Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentData && (
            <div className="space-y-2">
              <p>Amount: {formatCurrency(parseFloat(paymentData.amount))}</p>
              <p>Payment ID: {paymentData.paymentId || "Processing..."}</p>
              <p>Status: {paymentData.status}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (paymentStatus === "error") {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" /> Payment Failed
          </CardTitle>
          <CardDescription>
            There was an error processing your payment. Please try again.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => setPaymentStatus("idle")}>Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {paymentData && (
          <div className="space-y-2">
            <p>Amount: {formatCurrency(parseFloat(paymentData.amount))}</p>
            <p>Payment for: {paymentData.paymentFor}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handlePayment} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}