import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertConsultationSchema } from "@shared/schema";

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
  Calendar as CalendarIcon, 
  Check, 
  User, 
  Phone, 
  Calendar as CalendarLucide,
  ClipboardList,
  Clock,
  CalendarCheck,
  CalendarX
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

// Extend the consultation schema for client-side validation
const consultationFormSchema = insertConsultationSchema.extend({
  preferredDate: z.union([
    z.date({
      required_error: "Please select a date",
      invalid_type_error: "Please select a valid date",
    }).refine(date => date > new Date(), {
      message: "Please select a future date"
    }),
    z.string().refine(date => !isNaN(Date.parse(date)), {
      message: "Please select a valid date"
    }).transform(date => new Date(date))
  ]),
  topic: z.string({
    required_error: "Please select a consultation topic",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  preferredTime: z.string({
    required_error: "Please select a preferred time",
  }),
  notes: z.string().optional(),
  userId: z.number().optional(),
}).omit({ userId: true });

type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

export default function ConsultationPage() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [consultationId, setConsultationId] = useState<number | null>(null);
  
  // Consultation topics
  const consultationTopics = [
    "Home Loan Consultation",
    "Loan Against Property",
    "Balance Transfer Options",
    "SIP Investment Planning",
    "Financial Planning",
    "Retirement Planning",
    "Tax Planning",
    "Wealth Management",
    "Debt Consolidation",
    "Other Financial Services"
  ];
  
  // Available time slots
  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
  ];

  // Initialize form with default values
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      topic: "",
      name: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      preferredTime: "",
      notes: "",
    },
  });

  // Create consultation mutation
  const createConsultationMutation = useMutation({
    mutationFn: async (data: ConsultationFormValues) => {
      // Transform form data to match API expectations
      const apiData = {
        topic: data.topic,
        preferredDate: data.preferredDate,
        notes: data.notes || "",
      };
      
      const res = await apiRequest("POST", "/api/consultations", apiData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      setIsSubmitting(false);
      
      // Set the consultation ID and show the payment gateway
      setConsultationId(data.id);
      setShowPayment(true);
    },
    onError: (error) => {
      console.error("Error creating consultation:", error);
      setIsSubmitting(false);
    }
  });
  
  // Handle payment success
  const handlePaymentSuccess = (paymentData: any) => {
    console.log("Payment successful:", paymentData);
    setShowPayment(false);
    setIsSuccess(true);
    
    // Navigate to dashboard after a delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  };
  
  // Handle payment failure
  const handlePaymentFailure = (error: any) => {
    console.error("Payment failed:", error);
    // Keep the payment component open to retry
  };

  // Handle form submission
  const onSubmit = (data: ConsultationFormValues) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    setIsSubmitting(true);
    createConsultationMutation.mutate(data);
  };

  // Allow viewing the page without authentication
  useEffect(() => {
    // No redirect here, users will be prompted to login on form submission
  }, []);

  return (
    <div>
      <main className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {isSuccess ? (
              <Card className="mb-8">
                <CardContent className="pt-6 pb-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Consultation Booked Successfully!</h2>
                  <p className="text-gray-600 mb-6">
                    Your consultation has been scheduled. You will receive a confirmation email shortly.
                  </p>
                  <Button onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>
            ) : showPayment && consultationId ? (
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
                      Your consultation has been reserved. To confirm your booking, please complete the payment. 
                      The consultation fee is ₹999 and includes personalized financial advice from our expert advisors.
                    </p>
                    <PaymentGateway
                      paymentType="consultation"
                      itemId={consultationId}
                      onSuccess={handlePaymentSuccess}
                      onFailure={handlePaymentFailure}
                      buttonText="Pay ₹999 to Confirm Booking"
                      description="Secure payment via Razorpay"
                    />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                    Book Your Financial Consultation
                  </h1>
                  <p className="text-neutral-600 max-w-3xl mx-auto">
                    Our financial experts will help you understand your options and create a personalized plan to achieve your financial goals.
                    <span className="block mt-2 text-sm font-semibold">Consultation fee: ₹999</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                  <div className="md:col-span-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Schedule a Consultation</CardTitle>
                        <CardDescription>
                          Fill in your details to book a session with our financial experts
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="topic"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Consultation Topic</FormLabel>
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
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Your Name</FormLabel>
                                    <FormControl>
                                      <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 bg-neutral-50 text-neutral-500">
                                          <User className="h-4 w-4" />
                                        </span>
                                        <Input
                                          placeholder="Enter your full name"
                                          className="rounded-l-none"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 bg-neutral-50 text-neutral-500">
                                          <Phone className="h-4 w-4" />
                                        </span>
                                        <Input
                                          placeholder="Enter your phone number"
                                          className="rounded-l-none"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="Enter your email address"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    We'll send confirmation and meeting details to this email
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="preferredDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Preferred Date</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "pl-3 text-left font-normal",
                                              !field.value && "text-muted-foreground"
                                            )}
                                          >
                                            {field.value ? (
                                              format(field.value, "PPP")
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={field.value as Date}
                                          onSelect={field.onChange}
                                          disabled={(date) => 
                                            date < new Date() || // Can't select days in the past
                                            date.getDay() === 0 || // Can't select Sundays
                                            date.getDay() === 6    // Can't select Saturdays
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                      Select a weekday (Monday to Friday)
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="preferredTime"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Preferred Time</FormLabel>
                                    <Select 
                                      value={field.value} 
                                      onValueChange={field.onChange}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a time slot" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {timeSlots.map((slot) => (
                                          <SelectItem key={slot} value={slot}>
                                            {slot}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      All times are in Indian Standard Time (IST)
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="notes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Additional Notes (Optional)</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Please share any specific questions or topics you'd like to discuss"
                                      className="min-h-[100px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit"
                              className="w-full"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Booking Your Consultation..." : "Book My Free Consultation"}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
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
                              Our team consists of certified financial experts with years of experience
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
                              Get a customized financial roadmap tailored to your specific goals
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
                              Choose a time that works best for your busy schedule
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
                              Your initial consultation is completely free with no obligations
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
                            <span className="text-primary font-semibold">1</span>
                          </div>
                          <p className="text-sm">Initial assessment of your financial situation</p>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="text-primary font-semibold">2</span>
                          </div>
                          <p className="text-sm">Discussion about your financial goals and timeline</p>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="text-primary font-semibold">3</span>
                          </div>
                          <p className="text-sm">Explanation of suitable financial products</p>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="text-primary font-semibold">4</span>
                          </div>
                          <p className="text-sm">Recommendations and next steps</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-[#FFB800]/30 bg-[#FFB800]/5">
                      <CardContent className="pt-6">
                        <div className="flex items-start">
                          <CalendarX className="h-10 w-10 text-[#FFB800] mr-4" />
                          <div>
                            <h3 className="font-semibold text-lg mb-1">Need to Reschedule?</h3>
                            <p className="text-sm text-neutral-600">
                              If you need to reschedule your consultation, you can do so from your dashboard up to 24 hours before your appointment.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="mt-8 bg-neutral-100 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-center mb-8">What Our Clients Say</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-[#FFB800] text-3xl">"</div>
                        <p className="text-neutral-700 mb-6">
                          The consultation was incredibly helpful. The advisor explained complex financial concepts in a way that was easy to understand and gave me practical advice for my home loan.
                        </p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-neutral-500" />
                          </div>
                          <div>
                            <p className="font-semibold">Rahul Sharma</p>
                            <p className="text-xs text-neutral-500">Home Loan Customer</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-[#FFB800] text-3xl">"</div>
                        <p className="text-neutral-700 mb-6">
                          I was unsure about starting SIPs, but after my consultation, I felt confident to begin my investment journey. The personalized plan they created was perfect for my goals.
                        </p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-neutral-500" />
                          </div>
                          <div>
                            <p className="font-semibold">Priya Patel</p>
                            <p className="text-xs text-neutral-500">SIP Investor</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-[#FFB800] text-3xl">"</div>
                        <p className="text-neutral-700 mb-6">
                          The financial advisor helped me understand my options for Balance Transfer Top-Up and saved me a significant amount on my EMIs. Highly recommended!
                        </p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-neutral-500" />
                          </div>
                          <div>
                            <p className="font-semibold">Arjun Mehta</p>
                            <p className="text-xs text-neutral-500">BT Top-Up Customer</p>
                          </div>
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
