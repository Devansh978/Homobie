import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ChatbotButton } from "@/components/layout/chatbot-button";
import { PaymentGateway } from "@/components/ui/payment-gateway";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays as CalendarIcon,
  Check,
  User,
  Phone,
  ClipboardList,
  Clock,
  CalendarCheck,
  CalendarX,
  Loader2,
  Mail,
  AlertCircle,
  Calendar,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";

// Simplified consultation form schema
const consultationFormSchema = z.object({
  topic: z.string({
    required_error: "Please select a consultation topic",
  }).min(1, "Topic cannot be blank"),
  userId: z.string().min(1, "User ID is required"),
  timeSlotId: z.string().min(1, "Please select a time slot"),
  description: z.string().optional(),
  preferredLanguage: z.string().optional(),
});

// Guest form schema
const guestFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

// Email verification schema
const emailVerifySchema = z.object({
  email: z.string().email("Please enter a valid email"),
  verificationCode: z.string().min(6, "Verification code must be 6 digits"),
});

// Cancel form schema
const cancelFormSchema = z.object({
  consultationId: z.string().min(1, "Invalid consultation ID"),
  userId: z.string().min(1, "Invalid user ID"),
  cancelRemark: z.string().min(1, "Cancel remark cannot be blank"),
  cancelReason: z.string().optional(),
});

// Reschedule form schema
const rescheduleFormSchema = z.object({
  rescheduleRemark: z.string().min(1, "Reschedule remark cannot be blank"),
  timeSlotId: z.string().min(1, "Please select a new time slot"),
  userId: z.string().min(1, "Invalid user ID"),
  consultationId: z.string().min(1, "Invalid consultation ID"),
  rescheduleReason: z.string().optional(),
});

type ConsultationFormValues = z.infer<typeof consultationFormSchema>;
type GuestFormValues = z.infer<typeof guestFormSchema>;
type EmailVerifyValues = z.infer<typeof emailVerifySchema>;
type CancelFormValues = z.infer<typeof cancelFormSchema>;
type RescheduleFormValues = z.infer<typeof rescheduleFormSchema>;

const BASE_URL = 'https://api.homobie.com';

export default function ConsultationPage() {
  const [location, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [selectedConsultationForAction, setSelectedConsultationForAction] = useState<any>(null);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [authData, setAuthData] = useState<{ token: string | null; userId: string | null;  timeSlotId: string | null; user: any | null; }>({
    token: null,
    userId: null,
    user: null,
    timeSlotId: null,
  });

  const savedTimeslotId = localStorage.getItem('timeslotId');
const savedTimeslot = JSON.parse(localStorage.getItem('selectedTimeslot') || 'null');
// Save timeSlotId in localStorage
const saveTimeSlotId = (timeSlotId: string) => {
  localStorage.setItem("timeSlotId", timeSlotId);
};

// Get timeSlotId from localStorage
const getTimeSlotId = () => {
  return localStorage.getItem("timeSlotId");
};

// Remove timeSlotId from localStorage
const removeTimeSlotId = () => {
  localStorage.removeItem("timeSlotId");
};
  // Enhanced auth data retrieval with better error handling
  const getAuthDataFromStorage = () => {
    try {
      const authToken = localStorage.getItem('auth_token');
      const userIdFromStorage = localStorage.getItem('userId');
      const userDataStr = localStorage.getItem('user');

      let userData = null;
      if (userDataStr) {
        try {
          userData = JSON.parse(userDataStr);
        } catch (parseError) {
          console.error('Error parsing user data from localStorage:', parseError);
        }
      }



      return {
        token: authToken,
        userId: userIdFromStorage || userData?.id,
        user: userData
      };
    } catch (error) {
      console.error('Error getting auth data from storage:', error);
  
      return {
        token: null,
        userId: null,
        user: null
      };
    }
  };

  // ✅ FIX: Get auth data once on component mount to prevent re-render loop
  useEffect(() => {
    const data = getAuthDataFromStorage();
    setAuthData(data);
  }, []);

  const { token, userId, user } = authData;

  // Consultation topics
  const consultationTopics = [
    "Home Loan",
    
  ];

  // Enhanced API request helper with comprehensive debugging
  const authenticatedRequest = async (method: string, endpoint: string, data?: any) => {
    const requestId = Date.now().toString();
    const logMessage = (msg: string) => {
      const timeStamp = new Date().toLocaleTimeString();
      const logEntry = `[${timeStamp}][${requestId}] ${msg}`;
      console.log(logEntry);
     
    };

    try {
      // Get fresh auth data for each request
      const currentToken = localStorage.getItem('auth_token');
      const currentUserId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;

      logMessage(`=== ${method} ${endpoint} ===`);
      logMessage(`Auth Token: ${currentToken ? `${currentToken.substring(0, 20)}...` : 'NOT FOUND'}`);
      logMessage(`User ID: ${currentUserId || 'NOT FOUND'}`);

      if (!currentToken) {
        const errorMsg = 'Authentication token missing';
        logMessage(`ERROR: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      };

      logMessage(`Authorization header set with token`);

      const config: RequestInit = {
        method,
        headers,
        credentials: 'include',
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
        logMessage(`Request payload: ${JSON.stringify(data, null, 2)}`);
      }

      const url = `${BASE_URL}${endpoint}`;
      logMessage(`Request URL: ${url}`);
      logMessage(`Request headers: ${JSON.stringify(headers, null, 2)}`);

      const response = await fetch(url, config);
      logMessage(`Response status: ${response.status} ${response.statusText}`);

      // Log response headers
      const responseHeaders = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      logMessage(`Response headers: ${JSON.stringify(responseHeaders, null, 2)}`);

      if (!response.ok) {
        let errorText = '';
        let errorData = null;

        try {
          errorText = await response.text();
          logMessage(`Error response body: ${errorText}`);

          if (errorText) {
            try {
              errorData = JSON.parse(errorText);
              logMessage(`Parsed error data: ${JSON.stringify(errorData, null, 2)}`);
            } catch (parseError) {
              logMessage(`Could not parse error response as JSON: ${parseError.message}`);
            }
          }
        } catch (textError) {
          logMessage(`Could not read error response: ${textError.message}`);
        }

        const errorMessage = errorData?.message || errorData?.error || errorText || `HTTP ${response.status}`;
        logMessage(`ERROR: ${errorMessage}`);
        throw new Error(`API Error [${response.status}]: ${errorMessage}`);
      }

      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        const responseText = await response.text();
        logMessage(`Success response body: ${responseText}`);

        if (responseText) {
          try {
            responseData = JSON.parse(responseText);
            logMessage(`Parsed success data: ${JSON.stringify(responseData, null, 2)}`);
          } catch (parseError) {
            logMessage(`Could not parse success response as JSON: ${parseError.message}`);
            responseData = { success: true, rawResponse: responseText };
          }
        } else {
          responseData = { success: true };
        }
      } else {
        logMessage('Non-JSON response received');
        responseData = { success: true };
      }

      logMessage(`=== REQUEST COMPLETED SUCCESSFULLY ===`);
      return responseData;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logMessage(`=== REQUEST FAILED: ${errorMessage} ===`);

      if (error instanceof Error && error.message.startsWith('API Error')) {
        throw error;
      } else {
        throw new Error(`Network error: ${errorMessage}`);
      }
    }
  };

  // Fetch available time slots
const { data: availableSlots, isLoading: slotsLoading, error: slotsError } = useQuery({
  queryKey: ['consultation-available-slots', selectedDate],
  queryFn: async () => {
    if (!selectedDate) {
      throw new Error("No date selected");
    }
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const timezone = 'Asia/Kolkata';

    const response = await authenticatedRequest('GET', `/consultation/available-slots?date=${dateStr}&timezone=${timezone}`);
    
    // Process the response and save timeslotId if available
    const slots = Array.isArray(response) ? response : response?.slots || response?.data || [];
    
    // If you want to save a specific timeslotId from the first available slot
    if (slots.length > 0 && slots[0].timeslotId) {
      localStorage.setItem('timeslotId', slots[0].timeslotId);
    }
    
    return slots;
  },
  enabled: !!selectedDate && !!token,
  retry: 2,
  onError: (error) => {
    console.error("Error fetching available slots:", error);
    toast.error("Failed to load available time slots");
    setApiErrors(prev => ({ ...prev, slots: error instanceof Error ? error.message : 'Unknown error' }));
  }
});

 // Fetch user's consultations
const { data: userConsultations, refetch: refetchConsultations, error: consultationsError } = useQuery({
  queryKey: ['user-consultations', userId],
  queryFn: async () => {
    const storedUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!token || !storedUserId) {
      throw new Error("User not authenticated");
    }

    // Try using template literal in URL instead of params
    const response = await authenticatedRequest('GET', `/consultation/all-bookings?userId=${storedUserId}`);
    return Array.isArray(response) ? response : response?.consultations || response?.data || [];
  },
  enabled: !!localStorage.getItem('token') && !!localStorage.getItem('userId'),
  retry: 2,
  onError: (error) => {
    console.error("Error fetching user consultations:", error);
    toast.error("Failed to load your consultations");
    setApiErrors(prev => ({ ...prev, consultations: error instanceof Error ? error.message : 'Unknown error' }));
  }
});

  // Initialize forms with proper default values
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      topic: "",
      userId: userId || "",
      timeSlotId: "",
      description: "",
      preferredLanguage: "English",
    },
  });

  const guestForm = useForm<GuestFormValues>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const emailVerifyForm = useForm<EmailVerifyValues>({
    resolver: zodResolver(emailVerifySchema),
    defaultValues: {
      email: "",
      verificationCode: "",
    },
  });

  const cancelForm = useForm<CancelFormValues>({
    resolver: zodResolver(cancelFormSchema),
    defaultValues: {
      consultationId: "",
      userId: userId || "",
      cancelRemark: "",
      cancelReason: "",
    },
  });

  const rescheduleForm = useForm<RescheduleFormValues>({
    resolver: zodResolver(rescheduleFormSchema),
    defaultValues: {
      rescheduleRemark: "",
      timeSlotId: "",
      userId: userId || "",
      consultationId: "",
      rescheduleReason: "",
    },
  });

  // Email verification mutation
  const emailVerifyMutation = useMutation({
    mutationFn: async (data: EmailVerifyValues) => {
      const payload = {
        email: data.email,
        verificationCode: data.verificationCode,
      };

      console.log('Sending email verification payload:', payload);
      // Use POST method for email verification
      return await authenticatedRequest('POST', '/auth/email-verify', payload);
    },
    onSuccess: (data) => {
      setIsSubmitting(false);
      toast.success("Email verified successfully!");
      setShowEmailVerify(false);
      emailVerifyForm.reset();
      setApiErrors(prev => ({ ...prev, emailVerify: "" }));
    },
    onError: (error) => {
      console.error("Error verifying email:", error);
      setIsSubmitting(false);
      toast.error(`Email verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

      setApiErrors(prev => ({
        ...prev,
        emailVerify: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  });

  // Create consultation mutation
  const createConsultationMutation = useMutation({
    mutationFn: async (data: ConsultationFormValues) => {
      const currentToken = localStorage.getItem('auth_token');
      const currentUserId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;

      if (!currentToken || !currentUserId) {
        throw new Error("Authentication required. Please log in.");
      }

      const guestData = guestForm.getValues();

      const payload = {
        topic: data.topic,
        userId: currentUserId,
        timeSlotId: data.timeSlotId,
        description: data.description || "",
        preferredLanguage: data.preferredLanguage || "English",
        clientName: user?.fullName || user?.name || guestData.name,
        clientEmail: user?.email || guestData.email,
        clientPhone: user?.phone || guestData.phone,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      
      console.log('Sending consultation booking payload:', payload);
      return await authenticatedRequest('POST', '/consultation/book', payload);
    },
    onSuccess: (data) => {
      if (userConsultations) {
        refetchConsultations();
      }
      setIsSubmitting(false);

      const responseId = data?.consultationId || data?.id || data?.data?.consultationId || data?.data?.id;
      setConsultationId(responseId);

      if (responseId) {
        setShowPayment(true);
        toast.success("Consultation booked successfully!");
      } else {
        setIsSuccess(true);
        toast.success("Consultation booked successfully!");
      }

      setApiErrors(prev => ({ ...prev, booking: "" }));
    },
    onError: (error) => {
      console.error("Error creating consultation:", error);
      setIsSubmitting(false);
      toast.error(`Failed to book consultation: ${error instanceof Error ? error.message : 'Unknown error'}`);

      setApiErrors(prev => ({
        ...prev,
        booking: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  });

  // Cancel consultation mutation
  const cancelConsultationMutation = useMutation({
    mutationFn: async (data: CancelFormValues) => {
      const currentToken = localStorage.getItem('auth_token');
      const currentUserId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;

      if (!currentToken || !currentUserId) {
        throw new Error("Authentication required. Please log in.");
      }

      const payload = {
        consultationId: data.consultationId,
        userId: currentUserId,
        cancelRemark: data.cancelRemark,
        cancelReason: data.cancelReason || "",
        cancelledAt: new Date().toISOString(),
        cancelledBy: currentUserId,
      };

      console.log('Sending consultation cancel payload:', payload);
      return await authenticatedRequest('POST', '/consultation/cancel', payload);
    },
    onSuccess: () => {
      refetchConsultations();
      setShowCancelForm(false);
      setSelectedConsultationForAction(null);
      cancelForm.reset();
      toast.success("Consultation cancelled successfully");
      setApiErrors(prev => ({ ...prev, cancel: "" }));
    },
    onError: (error) => {
      console.error("Error cancelling consultation:", error);
      toast.error(`Failed to cancel consultation: ${error instanceof Error ? error.message : 'Unknown error'}`);

      setApiErrors(prev => ({
        ...prev,
        cancel: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  });

  // Reschedule consultation mutation
  const rescheduleConsultationMutation = useMutation({
    mutationFn: async (data: RescheduleFormValues) => {
      const currentToken = localStorage.getItem('auth_token');
      const currentUserId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;
      const timeSlotId = getTimeSlotId();

      if (!currentToken || !currentUserId) {
        throw new Error("Authentication required. Please log in.");
      }

      const payload = {
        consultationId: data.consultationId,
        userId: currentUserId,
        timeSlotId: data.timeSlotId,
        rescheduleRemark: data.rescheduleRemark,
        rescheduleReason: data.rescheduleReason || "",
        rescheduledAt: new Date().toISOString(),
        rescheduledBy: currentUserId,
      };

      console.log('Sending consultation reschedule payload:', payload);
      return await authenticatedRequest('POST', '/consultation/reschedule', payload);
    },
    onSuccess: () => {
      refetchConsultations();
      setShowRescheduleForm(false);
      setSelectedConsultationForAction(null);
      rescheduleForm.reset();
      setSelectedDate(undefined);
      toast.success("Consultation rescheduled successfully");
      setApiErrors(prev => ({ ...prev, reschedule: "" }));
    },
    onError: (error) => {
      console.error("Error rescheduling consultation:", error);
      toast.error(`Failed to reschedule consultation: ${error instanceof Error ? error.message : 'Unknown error'}`);

      setApiErrors(prev => ({
        ...prev,
        reschedule: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  });

  // Handle payment success
  const handlePaymentSuccess = (paymentData: any) => {
    console.log("Payment successful:", paymentData);
    setIsSuccess(true);
    toast.success("Payment completed successfully!");

    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  };

  // Handle payment failure
  const handlePaymentFailure = (error: any) => {
    console.error("Payment failed:", error);
    toast.error("Payment failed. Please try again.");
    setShowPayment(false);
  };

  // Handle email verification
  const onSubmitEmailVerify = async (data: EmailVerifyValues) => {
    setIsSubmitting(true);
    setApiErrors(prev => ({ ...prev, emailVerify: "" }));

    try {
      await emailVerifyMutation.mutateAsync(data);
    } catch (error) {
      console.error("Email verification failed:", error);
      setIsSubmitting(false);
    }
  };

  // Handle consultation booking
  const onSubmitConsultation = async (data: ConsultationFormValues) => {
    // Check authentication first
    const currentToken = localStorage.getItem('auth_token');
    const currentUserId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;

    if (!currentToken || !currentUserId) {
      toast.error("Please log in to book a consultation");
      navigate("/auth");
      return;
    }

    // Validate guest form if user data is not available
    if (!user) {
      const guestValidation = await guestForm.trigger();
      if (!guestValidation) {
        toast.error("Please fill in all required contact information");
        return;
      }
    }

    setIsSubmitting(true);
    setApiErrors(prev => ({ ...prev, booking: "" }));

    try {
      await createConsultationMutation.mutateAsync({
        ...data,
        userId: currentUserId,
      });
    } catch (error) {
      console.error("Consultation booking failed:", error);
      setIsSubmitting(false);
    }
  };

  // Handle consultation cancellation
  const onSubmitCancel = async (data: CancelFormValues) => {
    setApiErrors(prev => ({ ...prev, cancel: "" }));

    try {
      const currentUserId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;
      await cancelConsultationMutation.mutateAsync({
        ...data,
        userId: currentUserId,
      });
    } catch (error) {
      console.error("Consultation cancellation failed:", error);
    }
  };

  // Handle consultation rescheduling
  const onSubmitReschedule = async (data: RescheduleFormValues) => {
    setApiErrors(prev => ({ ...prev, reschedule: "" }));

    try {
      const currentUserId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;
      await rescheduleConsultationMutation.mutateAsync({
        ...data,
        userId: currentUserId,
      });
    } catch (error) {
      console.error("Consultation rescheduling failed:", error);
    }
  };

  // Handle cancel consultation action
  const handleCancelConsultation = (consultation: any) => {
    setSelectedConsultationForAction(consultation);
    const currentUserId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;
    cancelForm.setValue('consultationId', consultation.consultationId || consultation.id);
    cancelForm.setValue('userId', currentUserId || '');
    setShowCancelForm(true);
  };

  // Handle reschedule consultation action
  const handleRescheduleConsultation = (consultation: any) => {
    setSelectedConsultationForAction(consultation);
    const currentUserId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;
    rescheduleForm.setValue('consultationId', consultation.consultationId || consultation.id);
    rescheduleForm.setValue('userId', currentUserId || '');
    setShowRescheduleForm(true);
  };

  // Update forms when auth data changes
  useEffect(() => {
    if (userId) {
      form.setValue('userId', userId);
      cancelForm.setValue('userId', userId);
      rescheduleForm.setValue('userId', userId);
    }
  }, [userId, form, cancelForm, rescheduleForm]);

  // Reset time slot when date changes
  useEffect(() => {
    form.setValue('timeSlotId', '');
    rescheduleForm.setValue('timeSlotId', '');
  }, [selectedDate, form, rescheduleForm]);

  return (
    <div className='bg-black'>
      <main className=" pt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* API Error Banner */}
            {Object.values(apiErrors).some((error) => error) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="text-red-800 font-medium">API Error</h3>
                </div>
                {Object.entries(apiErrors).map(([key, error]) =>
                  error ? (
                    <p key={key} className="text-red-700 text-sm mt-1">
                      <strong>{key}:</strong> {error}
                    </p>
                  ) : null
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setApiErrors({})}
                  className="mt-2"
                >
                  Clear Errors
                </Button>
              </div>
            )}

            {/* Success State */}
            {isSuccess ? (
              <Card className="mb-8">
                <CardContent className="pt-6 pb-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Consultation Booked Successfully!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your consultation has been scheduled. You will receive a
                    confirmation email shortly.
                  </p>
                  <Button onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>
            ) : /* Payment State */
            showPayment && consultationId ? (
              <div className="max-w-md mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Consultation Payment</CardTitle>
                    <CardDescription>
                      Complete your payment to confirm your consultation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6">
                      Your consultation has been reserved. To confirm your
                      booking, please complete the payment. The consultation fee
                      is ₹0 and includes personalized financial advice from our
                      expert advisors.
                    </p>
                    <PaymentGateway
                      paymentType="consultation"
                      itemId={consultationId}
                      onSuccess={handlePaymentSuccess}
                      onFailure={handlePaymentFailure}
                      buttonText="Pay ₹0 to Confirm Booking"
                      description="Secure payment via Razorpay"
                    />
                    <Button
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() => setShowPayment(false)}
                    >
                      Go Back
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : /* Email Verification State */
            showEmailVerify ? (
              <div className="max-w-md mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Verification</CardTitle>
                    <CardDescription>
                      Enter the verification code sent to your email
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...emailVerifyForm}>
                      <form
                        onSubmit={emailVerifyForm.handleSubmit(
                          onSubmitEmailVerify
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={emailVerifyForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 bg-black text-black0">
                                    <Mail className="h-4 w-4" />
                                  </span>
                                  <Input
                                    className="bg-transparent text-white border border-white placeholder-gray-400"
                                    type="email"
                                    placeholder="Enter your email address"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={emailVerifyForm.control}
                          name="verificationCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Verification Code</FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 bg-black text-black0">
                                    <Shield className="h-4 w-4" />
                                  </span>
                                  <Input
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    className="bg-transparent text-white border border-white placeholder-gray-400"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex space-x-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowEmailVerify(false)}
                            className="flex-1"
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={
                              emailVerifyMutation.isPending || isSubmitting
                            }
                            className="flex-1"
                          >
                            {emailVerifyMutation.isPending || isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              "Verify Email"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            ) : /* Cancel Form State */
            showCancelForm ? (
              <div className="max-w-md mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Cancel Consultation</CardTitle>
                    <CardDescription>
                      Please provide a reason for cancelling your consultation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...cancelForm}>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-4">
                            <strong>Topic:</strong>{" "}
                            {selectedConsultationForAction?.topic}
                            <br />
                            <strong>Date:</strong>{" "}
                            {selectedConsultationForAction?.timeStamp &&
                              format(
                                new Date(
                                  selectedConsultationForAction.timeStamp
                                ),
                                "PPp"
                              )}
                          </p>
                        </div>

                        <FormField
                          control={cancelForm.control}
                          name="cancelReason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cancellation Category</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a reason category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="schedule_conflict">
                                    Schedule Conflict
                                  </SelectItem>
                                  <SelectItem value="emergency">
                                    Emergency
                                  </SelectItem>
                                  <SelectItem value="health_issue">
                                    Health Issue
                                  </SelectItem>
                                  <SelectItem value="travel">Travel</SelectItem>
                                  <SelectItem value="financial_constraint">
                                    Financial Constraint
                                  </SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={cancelForm.control}
                          name="cancelRemark"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Detailed Reason</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please provide a detailed reason for cancelling this consultation"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex space-x-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowCancelForm(false);
                              setSelectedConsultationForAction(null);
                              cancelForm.reset();
                            }}
                            className="flex-1"
                          >
                            Back
                          </Button>
                          <Button
                            type="button"
                            onClick={cancelForm.handleSubmit(onSubmitCancel)}
                            disabled={cancelConsultationMutation.isPending}
                            variant="destructive"
                            className="flex-1"
                          >
                            {cancelConsultationMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              "Cancel Consultation"
                            )}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            ) : /* Reschedule Form State */
            showRescheduleForm ? (
              <div className="max-w-md mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Reschedule Consultation</CardTitle>
                    <CardDescription>
                      Select a new time slot and provide a reason for
                      rescheduling
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...rescheduleForm}>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-4">
                            <strong>Current Topic:</strong>{" "}
                            {selectedConsultationForAction?.topic}
                            <br />
                            <strong>Current Date:</strong>{" "}
                            {selectedConsultationForAction?.timeStamp &&
                              format(
                                new Date(
                                  selectedConsultationForAction.timeStamp
                                ),
                                "PPp"
                              )}
                          </p>
                        </div>

                        <FormField
                          control={rescheduleForm.control}
                          name="rescheduleReason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reschedule Category</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a reason category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="schedule_conflict">
                                    Schedule Conflict
                                  </SelectItem>
                                  <SelectItem value="emergency">
                                    Emergency
                                  </SelectItem>
                                  <SelectItem value="health_issue">
                                    Health Issue
                                  </SelectItem>
                                  <SelectItem value="travel">Travel</SelectItem>
                                  <SelectItem value="better_time">
                                    Need Better Time Slot
                                  </SelectItem>
                                  <SelectItem value="preparation">
                                    Need More Preparation Time
                                  </SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={rescheduleForm.control}
                          name="rescheduleRemark"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Detailed Reason</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please provide a detailed reason for rescheduling this consultation"
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-2">
                            New Preferred Date
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !selectedDate && "text-muted-foreground"
                                )}
                              >
                                {selectedDate ? (
                                  format(selectedDate, "PPP")
                                ) : (
                                  <span>Pick a new date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <CalendarComponent
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(date) =>
                                  date <
                                    new Date(new Date().setHours(0, 0, 0, 0)) ||
                                  date.getDay() === 0 ||
                                  date.getDay() === 6
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <FormField
                          control={rescheduleForm.control}
                          name="timeSlotId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Time Slot</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={!selectedDate || slotsLoading}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={
                                        !selectedDate
                                          ? "Select a date first"
                                          : slotsLoading
                                          ? "Loading slots..."
                                          : "Select a new time slot"
                                      }
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {slotsLoading ? (
                                    <SelectItem value="loading" disabled>
                                      <div className="flex items-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Loading slots...
                                      </div>
                                    </SelectItem>
                                  ) : availableSlots &&
                                    availableSlots.length > 0 ? (
                                    availableSlots.map((slot: any) => (
                                      <SelectItem
                                        key={slot.timeSlotId || slot.id}
                                        value={slot.timeSlotId || slot.id}
                                      >
                                        {format(
                                          new Date(
                                            slot.slotTime || slot.startTime
                                          ),
                                          "HH:mm"
                                        )}{" "}
                                        -{" "}
                                        {format(
                                          new Date(
                                            new Date(
                                              slot.slotTime || slot.startTime
                                            ).getTime() +
                                              60 * 60 * 1000
                                          ),
                                          "HH:mm"
                                        )}
                                      </SelectItem>
                                    ))
                                  ) : selectedDate ? (
                                    <SelectItem value="no-slots" disabled>
                                      No available slots for this date
                                    </SelectItem>
                                  ) : null}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex space-x-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowRescheduleForm(false);
                              setSelectedConsultationForAction(null);
                              rescheduleForm.reset();
                              setSelectedDate(undefined);
                            }}
                            className="flex-1"
                          >
                            Back
                          </Button>
                          <Button
                            type="button"
                            onClick={rescheduleForm.handleSubmit(
                              onSubmitReschedule
                            )}
                            disabled={
                              rescheduleConsultationMutation.isPending ||
                              !selectedDate
                            }
                            className="flex-1"
                          >
                            {rescheduleConsultationMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Rescheduling...
                              </>
                            ) : (
                              "Reschedule Consultation"
                            )}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Main Booking Form */
              <>
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Book Your Financial Consultation
                  </h1>
                  <p className="text-white max-w-3xl mx-auto">
                    Our financial experts will help you understand your options
                    and create a personalized plan to achieve your financial
                    goals.
                    <span className="block mt-2 text-sm font-semibold">
                      Consultation fee: ₹0
                    </span>
                  </p>
                </div>

                {/* Authentication Status Display */}
                {(!token || !userId) && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                      <div>
                        <p className="text-amber-800 font-medium">
                          Authentication Required
                        </p>
                        <p className="text-amber-700 text-sm">
                          Please log in to book a consultation. You'll be
                          redirected to the login page after filling the form.
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => navigate("/auth")}
                        variant="outline"
                      >
                        Log In Now
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowEmailVerify(true)}
                      >
                        Verify Email
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                  {/* --- LEFT COLUMN: Main Form --- */}
                  <div className="md:col-span-3 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Schedule a Consultation</CardTitle>
                        <CardDescription>
                          Fill in your details to book a session with our
                          financial experts
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Guest User Information Form */}
                        {!user && (
                          <Card className="mb-6 bg-black">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">
                                Your Information
                              </CardTitle>
                              <CardDescription>
                                Please provide your contact details
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Form {...guestForm}>
                                <div className="space-y-4">
                                  <FormField
                                    control={guestForm.control}
                                    name="name"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Full Name *</FormLabel>
                                        <FormControl>
                                          <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-md border border-neutral-300 mr-2 bg-black text-white">
                                              <User className="h-4 w-4" />
                                            </span>
                                            <Input
                                              placeholder="Enter your full name"
                                              className="bg-transparent text-white border border-white placeholder-gray-400"
                                              {...field}
                                            />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={guestForm.control}
                                    name="email"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Email Address *</FormLabel>
                                        <FormControl>
                                          <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-md border border-neutral-300 mr-2 bg-black text-white">
                                              <Mail className="h-4 w-4" />
                                            </span>
                                            <Input
                                              type="email"
                                              placeholder="Enter your email address"
                                              className="bg-transparent text-white border border-white placeholder-gray-400"
                                              {...field}
                                            />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={guestForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Phone Number *</FormLabel>
                                        <FormControl>
                                          <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-md border border-neutral-300 mr-2 bg-black text-white">
                                              <Phone className="h-4 w-4" />
                                            </span>
                                            <Input
                                              placeholder="Enter your phone number"
                                              className="bg-transparent text-white border border-white placeholder-gray-400"
                                              {...field}
                                            />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </Form>
                            </CardContent>
                          </Card>
                        )}

                        <Form {...form}>
                          <div className="space-y-6">
                            <FormField
                              control={form.control}
                              name="topic"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Consultation Topic *</FormLabel>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a topic" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {consultationTopics.map((topic) => (
                                        <SelectItem key={topic} value={topic}>
                                          {topic}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    Select the main topic you'd like to discuss
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Additional Details (Optional)
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      className="bg-transparent text-white border border-white placeholder-gray-400 min-h-[80px]"
                                      placeholder="Please provide any additional details about your consultation requirements..."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Share any specific questions or areas you'd
                                    like to focus on
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Authenticated User Info Display */}
                            {user && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="text-sm font-medium text-gray-700">
                                    Your Name
                                  </label>
                                  <div className="flex mt-1">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 bg-transparent text-black0">
                                      <User className="h-4 w-4" />
                                    </span>
                                    <Input
                                      value={
                                        user.fullName ||
                                        user.name ||
                                        "Not provided"
                                      }
                                      className="bg-transparent text-white border border-white placeholder-gray-400"
                                      disabled
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-gray-700">
                                    Email Address
                                  </label>
                                  <div className="flex mt-1">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 bg-transparent text-black0">
                                      <Mail className="h-4 w-4" />
                                    </span>
                                    <Input
                                      value={user.email || "Not provided"}
                                      className="bg-transparent text-white border border-white placeholder-gray-400"
                                      disabled
                                    />
                                  </div>
                                </div>

                                <div className="md:col-span-2">
                                  <label className="text-sm font-medium text-gray-700">
                                    Phone Number
                                  </label>
                                  <div className="flex mt-1">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 bg-transparent text-black0">
                                      <Phone className="h-4 w-4" />
                                    </span>
                                    <Input
                                      value={user.phone || "Not provided"}
                                      className="bg-transparent text-white border border-white placeholder-gray-400"
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            <FormField
                              control={form.control}
                              name="preferredLanguage"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Preferred Language</FormLabel>
                                  <Select
                                    className="bg-transparent text-white border border-white placeholder-gray-400"
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue
                                          className="bg-transparent text-white border border-white placeholder-gray-400"
                                          placeholder="Select your preferred language"
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="English">
                                        English
                                      </SelectItem>
                                      <SelectItem value="Hindi">
                                        Hindi
                                      </SelectItem>
                                      <SelectItem value="Gujarati">
                                        Gujarati
                                      </SelectItem>
                                      <SelectItem value="Marathi">
                                        Marathi
                                      </SelectItem>
                                      <SelectItem value="Bengali">
                                        Bengali
                                      </SelectItem>
                                      <SelectItem value="Tamil">
                                        Tamil
                                      </SelectItem>
                                      <SelectItem value="Telugu">
                                        Telugu
                                      </SelectItem>
                                      <SelectItem value="Kannada">
                                        Kannada
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    Choose the language you're most comfortable
                                    with
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="flex flex-col bg-transparent p-4 rounded-lg">
                                <label className="text-sm font-medium text-white mb-2">
                                  Preferred Date *
                                </label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal bg-transparent text-white border-neutral-700 hover:bg-neutral-900 hover:text-white",
                                        !selectedDate && "text-neutral-400"
                                      )}
                                    >
                                      {selectedDate ? (
                                        format(selectedDate, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-70 text-blue-400" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0 bg-neutral-900 border border-neutral-700 text-white"
                                    align="start"
                                  >
                                    <CalendarComponent
                                      mode="single"
                                      selected={selectedDate}
                                      onSelect={setSelectedDate}
                                      disabled={(date) =>
                                        date <
                                          new Date(
                                            new Date().setHours(0, 0, 0, 0)
                                          ) ||
                                        date.getDay() === 0 ||
                                        date.getDay() === 6
                                      }
                                      initialFocus
                                      className="text-white"
                                    />
                                  </PopoverContent>
                                </Popover>
                                <p className="text-sm text-neutral-400 mt-1">
                                  Select a weekday (Monday to Friday) - Today's
                                  consultations available!
                                </p>
                              </div>

                              <FormField
                                control={form.control}
                                name="timeSlotId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Available Time Slots *
                                    </FormLabel>
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                      disabled={!selectedDate || slotsLoading}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue
                                            placeholder={
                                              !selectedDate
                                                ? "Select a date first"
                                                : slotsLoading
                                                ? "Loading slots..."
                                                : "Select a time slot"
                                            }
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {slotsLoading ? (
                                          <SelectItem value="loading" disabled>
                                            <div className="flex items-center">
                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                              Loading slots...
                                            </div>
                                          </SelectItem>
                                        ) : availableSlots &&
                                          availableSlots.length > 0 ? (
                                          availableSlots.map((slot: any) => (
                                            <SelectItem
                                              key={slot.timeSlotId || slot.id}
                                              value={slot.timeSlotId || slot.id}
                                            >
                                              {format(
                                                new Date(
                                                  slot.slotTime ||
                                                    slot.startTime
                                                ),
                                                "HH:mm"
                                              )}{" "}
                                              -{" "}
                                              {format(
                                                new Date(
                                                  new Date(
                                                    slot.slotTime ||
                                                      slot.startTime
                                                  ).getTime() +
                                                    60 * 60 * 1000
                                                ),
                                                "HH:mm"
                                              )}
                                              {slot.isToday && (
                                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-1 rounded">
                                                  Today
                                                </span>
                                              )}
                                            </SelectItem>
                                          ))
                                        ) : selectedDate ? (
                                          <SelectItem value="no-slots" disabled>
                                            No available slots for this date
                                          </SelectItem>
                                        ) : null}
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      All times are in Indian Standard Time
                                      (IST)
                                    </FormDescription>
                                    <FormMessage />
                                    {slotsError && (
                                      <p className="text-sm text-red-600 mt-1">
                                        Error loading slots:{" "}
                                        {slotsError instanceof Error
                                          ? slotsError.message
                                          : "Unknown error"}
                                      </p>
                                    )}
                                  </FormItem>
                                )}
                              />
                            </div>

                            <Button
                              type="button"
                              onClick={form.handleSubmit(onSubmitConsultation)}
                              className="w-full"
                              disabled={
                                isSubmitting ||
                                !selectedDate ||
                                !form.watch("topic") ||
                                !form.watch("timeSlotId")
                              }
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Booking Your Consultation...
                                </>
                              ) : (
                                "Book My Free Consultation"
                              )}
                            </Button>
                          </div>
                        </Form>
                      </CardContent>
                    </Card>
                  </div>

                  {/* --- RIGHT COLUMN: Info & Existing Bookings --- */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Existing Consultations Management */}
                    {userConsultations && userConsultations.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Your Consultations</CardTitle>
                          <CardDescription>
                            Manage your existing consultations
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {userConsultations
                            .slice(0, 3)
                            .map((consultation: any) => (
                              <div
                                key={
                                  consultation.consultationId || consultation.id
                                }
                                className="p-4 bg-gray-50 rounded-lg"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">
                                      {consultation.topic}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {consultation.timeStamp
                                        ? format(
                                            new Date(consultation.timeStamp),
                                            "PPp"
                                          )
                                        : consultation.scheduledAt
                                        ? format(
                                            new Date(consultation.scheduledAt),
                                            "PPp"
                                          )
                                        : "Time not available"}
                                    </p>
                                  </div>
                                  <span
                                    className={cn(
                                      "px-2 py-1 text-xs rounded-full ml-2",
                                      consultation.status === "CONFIRMED"
                                        ? "bg-green-100 text-green-800"
                                        : consultation.status === "PENDING"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : consultation.status === "CANCELLED"
                                        ? "bg-red-100 text-red-800"
                                        : consultation.status === "COMPLETED"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                    )}
                                  >
                                    {consultation.status || "UNKNOWN"}
                                  </span>
                                </div>

                                {/* Action buttons for active consultations */}
                                {(consultation.status === "CONFIRMED" ||
                                  consultation.status === "PENDING") && (
                                  <div className="flex space-x-2 mt-3">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleRescheduleConsultation(
                                          consultation
                                        )
                                      }
                                      className="flex-1"
                                    >
                                      <Calendar className="w-3 h-3 mr-1" />
                                      Reschedule
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        handleCancelConsultation(consultation)
                                      }
                                      className="flex-1"
                                    >
                                      <CalendarX className="w-3 h-3 mr-1" />
                                      Cancel
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}

                          {userConsultations.length > 3 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => navigate("/dashboard")}
                            >
                              View All ({userConsultations.length})
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )}


                    <Card className="bg-primary text-white">
                      <CardHeader>
                        <CardTitle>Why Choose Our Consultation?</CardTitle>
                        <CardDescription className="text-primary-foreground/80">
                          Get expert advice on all your financial needs
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start">
                          <div className="mr-3 bg-white/20 p-2 rounded-full">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Expert Advisors</h3>
                            <p className="text-sm text-primary-foreground/80">
                              Our team consists of certified financial experts
                              with years of experience
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="mr-3 bg-white/20 p-2 rounded-full">
                            <ClipboardList className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Personalized Plans</h3>
                            <p className="text-sm text-primary-foreground/80">
                              Get a customized financial roadmap tailored to
                              your specific goals
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="mr-3 bg-white/20 p-2 rounded-full">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Flexible Scheduling</h3>
                            <p className="text-sm text-primary-foreground/80">
                              Choose a time that works best for your busy
                              schedule - including today!
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="mr-3 bg-white/20 p-2 rounded-full">
                            <CalendarCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">First Session Free</h3>
                            <p className="text-sm text-primary-foreground/80">
                              Your initial consultation is completely free with
                              no obligations
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle>What to Expect</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="text-primary font-semibold">
                              1
                            </span>
                          </div>
                          <p className="text-sm">
                            Review of your financial situation
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="text-primary font-semibold">
                              2
                            </span>
                          </div>
                          <p className="text-sm">
                            Discussion of your goals and challenges
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="text-primary font-semibold">
                              3
                            </span>
                          </div>
                          <p className="text-sm">
                            Explanation of suitable financial products
                          </p>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="text-primary font-semibold">
                              4
                            </span>
                          </div>
                          <p className="text-sm">
                            Recommendations and next steps
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <ChatbotButton />
    </div>
  );
}