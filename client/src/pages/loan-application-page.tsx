import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PaymentGateway } from "@/components/ui/payment-gateway";
// import { insertLoanApplicationSchema } from "@shared/schema";

import { ChatbotButton } from "@/components/layout/chatbot-button";
import { LoanCalculator } from "@/components/ui/calculator";
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
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Home, 
  Building, 
  ArrowRightLeft, 
  AlertCircle, 
  Check, 
  FileText, 
  Upload,
  DollarSign
} from "lucide-react";
import { getQueryParam, getLoanTypeLabel, calculateEMI } from "@/lib/utils";

// Application form schema
// const loanFormSchema = insertLoanApplicationSchema.extend({
  // Adding client-side validation
  // amount: z.coerce.number().min(100000, "Loan amount must be at least ₹1,00,000").max(10000000, "Loan amount cannot exceed ₹1,00,00,000"),
  // tenure: z.coerce.number().min(12, "Tenure must be at least 12 months").max(360, "Tenure cannot exceed 360 months"),
  // interestRate: z.coerce.number().min(5, "Interest rate must be at least 5%").max(20, "Interest rate cannot exceed 20%"),
  // monthlyIncome: z.coerce.number().min(10000, "Monthly income must be at least ₹10,000"),
  // propertyValue: z.coerce.number().optional(),
  // propertyAddress: z.string().optional(),
  // purpose: z.string().min(5, "Please provide a brief purpose for the loan").max(500, "Purpose cannot exceed 500 characters"),
  // employmentType: z.enum(["salaried", "self-employed"], {
  //   required_error: "Please select your employment type",
  // }),
  // existingLoanDetails: z.any().optional(),
  // Fields that will come from user context
//   userId: z.number().optional(),
// }).omit({ userId: true });

// type LoanFormValues = z.infer<typeof LoanFormValues>;

// Define the LoanFormValues type for useForm
type LoanFormValues = {
  loanType: "HomeLoan" | "LAP" | "BTTopUp";
  amount: number;
  tenure: number;
  interestRate: number;
  propertyValue?: number;
  propertyAddress?: string;
  purpose: string;
  monthlyIncome: number;
  employmentType: "salaried" | "self-employed";
  existingLoanDetails?: {
    lenderName?: string;
    accountNumber?: string;
    outstandingAmount?: number;
    currentRate?: number;
  };
};

export default function LoanApplicationPage() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("loan-details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Get loan type from URL query parameter
  const loanTypeParam = getQueryParam("type") || "home-loan";
  
  // Initialize form with default values
  const form = useForm<LoanFormValues>({
    // resolver: zodResolver(loanFormSchema),
    defaultValues: {
      loanType: getLoanTypeFromParam(loanTypeParam),
      amount: Number(getQueryParam("amount")) || 2500000,
      tenure: Number(getQueryParam("tenure")) || 240, // 20 years in months
      interestRate: Number(getQueryParam("interestRate")) || getLoanTypeDefaultRate(loanTypeParam),
      propertyValue: undefined,
      propertyAddress: "",
      purpose: "",
      monthlyIncome: 0,
      employmentType: "salaried",
      existingLoanDetails: loanTypeParam === "bt-topup" ? {} : undefined,
    },
  });

  // Function to get loan type string based on URL param
  function getLoanTypeFromParam(param: string): "HomeLoan" | "LAP" | "BTTopUp" {
    switch (param) {
      case "home-loan": return "HomeLoan";
      case "lap": return "LAP";
      case "bt-topup": return "BTTopUp";
      default: return "HomeLoan";
    }
  }

  // Function to get default interest rate based on loan type
  function getLoanTypeDefaultRate(param: string): number {
    switch (param) {
      case "home-loan": return 8.5;
      case "lap": return 9.5;
      case "bt-topup": return 8.0;
      default: return 8.5;
    }
  }

  // Initialize toast
  const { toast } = useToast();
  
  // Track submitted data for payment
  const [submittedData, setSubmittedData] = useState<any>(null);
  
  // Create loan application mutation
  const createLoanMutation = useMutation({
    mutationFn: async (data: LoanFormValues) => {
      const res = await apiRequest("POST", "/api/loan-applications", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      setSubmittedData(data);
      setIsSuccess(true);
      setIsSubmitting(false);
      // Remove the automatic navigation to allow payment
    },
    onError: (error) => {
      console.error("Error creating loan application:", error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to submit loan application. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Get loan amount, tenure, and interest rate from the form
  const watchAmount = form.watch("amount");
  const watchTenure = form.watch("tenure");
  const watchInterestRate = form.watch("interestRate");
  
  // Calculate EMI based on current form values
  const emiAmount = calculateEMI(
    Number(watchAmount),
    Number(watchInterestRate),
    Number(watchTenure) / 12 // Convert months to years
  );

  // Handle form submission
  // const onSubmit = async (data: LoanFormValues) => {
  //   if (!user) {
  //     navigate("/auth");
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     // 1. First submit to your backend API
  //     const apiResponse = await createLoanMutation.mutateAsync({
  //       ...data,
  //       userId: user.id // Ensure user ID is included
  //     });

  //     // 2. Then submit to Google Sheets (as secondary storage)
  //     try {
  //       const formData = new URLSearchParams();

  //       // Prepare data for Google Sheets
  //       const sheetsData = {
  //         ...data,
  //         applicationId: apiResponse.id,
  //         submissionDate: new Date().toISOString(),
  //         userId: user.id,
  //         userEmail: user.email,
  //         // userName: user.name,
  //         userPhone: user.phoneNumber
  //       };

  //       // Convert all values to strings
  //       Object.entries(sheetsData).forEach(([key, value]) => {
  //         formData.append(key, String(value !== undefined ? value : ''));
  //       });

  //       // Submit to Google Sheets
  //       const sheetsResponse = await fetch(
  //         "https://script.google.com/macros/s/AKfycbyO0YWyiac2VrIHOXOHVWAwAGhwX6DeRC41-71O1Ip3yC6yUxZcUBLUVtpQy1NWDGhZ/exec",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/x-www-form-urlencoded",
  //           },
  //           body: formData.toString(),
  //           mode: "no-cors",
  //         }
  //       );

  //       // Log successful submission (even though we can't read response in no-cors mode)
  //       console.log("Submitted to Google Sheets");
  //     } catch (sheetsError) {
  //       console.warn("Google Sheets submission failed (non-critical):", sheetsError);
  //       // This is non-critical, so we don't show error to user
  //     }

  //     // Success handling
  //     setSubmittedData(apiResponse);
  //     setIsSuccess(true);

  //     toast({
  //       title: "Success",
  //       description: "Loan application submitted successfully!",
  //     });

  //   } catch (error) {
  //     console.error("Submission failed:", error);

  //     let errorMessage = "Failed to submit application";
  //     if (error instanceof Error) {
  //       errorMessage = error.message.includes("502") 
  //         ? "Backend service unavailable. Please try again later."
  //         : error.message;
  //     }

  //     toast({
  //       title: "Error",
  //       description: errorMessage,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  function onSubmit(data: LoanFormValues) {
    // Set loading state
    setIsSubmitting(true);

    // First, submit to our backend API
    fetch("/api/loan-applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        userId: user?.id, // Include user info if available
        // userName: user?.name,
        userEmail: user?.email
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit loan application to server");
        }
        return response.json();
      })
      .then((apiResponse) => {
        console.log("Successfully submitted to database:", apiResponse);

        // Prepare the row data for Google Sheets
        const rowData = [
          new Date().toISOString(),
          apiResponse.id || '',
          data.loanType || '',
          data.amount || '',
          data.tenure || '',
          data.interestRate || '',
          data.monthlyIncome || '',
          data.propertyValue || '',
          data.propertyAddress || '',
          data.purpose || '',
          data.employmentType || '',
          data.existingLoanDetails?.lenderName || '',
          data.existingLoanDetails?.accountNumber || '',
          data.existingLoanDetails?.outstandingAmount || '',
          data.existingLoanDetails?.currentRate || '',
          user?.id || '',
          user?.name || '',
          user?.email || ''
        ];

        // Create form data for Google Script
        const formData = new URLSearchParams();
        rowData.forEach((value, index) => {
          formData.append(`col${index + 1}`, value.toString());
        });

        // Send to Google Sheets script as secondary storage
        return fetch(
          "https://script.google.com/macros/s/AKfycbyO0YWyiac2VrIHOXOHVWAwAGhwX6DeRC41-71O1Ip3yC6yUxZcUBLUVtpQy1NWDGhZ/exec",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
            mode: "no-cors",
          }
        ).catch((err) => {
          console.warn("Google Sheets submission had an issue:", err);
          return Promise.resolve();
        });
      })
      .then(() => {
        // Show success message
        toast({
          title: "Application Submitted",
          description: "Your loan application has been received successfully!",
        });
        setIsSuccess(true);
        setSubmittedData(data);
      })
      .catch((error) => {
        console.error("Form submission error:", error);
        toast({
          title: "Submission Failed",
          description: error.message || "There was a problem submitting your application.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }
  // Track if user is authenticated - we'll only enforce auth on submission
  useEffect(() => {
    // No redirect here, allow users to view the page without authentication
    // They'll be prompted to log in when they try to submit
  }, []);

  return (
    <div>
      <main className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {isSuccess ? (
              <div className="space-y-8">
                <Card className="mb-8">
                  <CardContent className="pt-6 pb-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
                    <p className="text-gray-600 mb-4">
                      Your loan application has been submitted. Application ID: <span className="font-medium">{submittedData?.id}</span>
                    </p>
                    <p className="text-gray-600 mb-6">
                      To proceed with your application, please complete the processing fee payment.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Processing Fee Payment</CardTitle>
                    <CardDescription>
                      A processing fee of 0.5% of the loan amount is required to proceed with your application.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      <PaymentGateway 
                        paymentType="loan-processing-fee" 
                        itemId={submittedData?.id} 
                        buttonText="Pay Processing Fee"
                        description="Pay processing fee to continue with your loan application"
                        onSuccess={(data) => {
                          toast({
                            title: "Payment Successful",
                            description: "Your loan application is now being processed.",
                          });
                        }}
                        onFailure={(error) => {
                          toast({
                            title: "Payment Failed",
                            description: error?.message || "There was an error processing your payment.",
                            variant: "destructive"
                          });
                        }}
                      />
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <p className="text-yellow-700 mb-2">Please login to make a payment</p>
                        <Button asChild>
                          <Link href="/auth">Login or Register</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
                    <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                    {getLoanTypeLabel(loanTypeParam)} Application
                  </h1>
                  <p className="text-neutral-600">
                    Complete the form below to apply for your {getLoanTypeLabel(loanTypeParam.toLowerCase())}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Loan Application Form</CardTitle>
                      <CardDescription>
                        Fill in all required information to submit your application
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="loan-details">Loan Details</TabsTrigger>
                          <TabsTrigger value="personal-details">Personal Details</TabsTrigger>
                        </TabsList>
                        
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)}>
                            <TabsContent value="loan-details" className="mt-6 space-y-6">
                              <FormField
                                control={form.control}
                                name="loanType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Loan Type</FormLabel>
                                    <Select 
                                      value={field.value} 
                                      onValueChange={field.onChange}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select loan type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="HomeLoan">Home Loan</SelectItem>
                                        <SelectItem value="LAP">Loan Against Property</SelectItem>
                                        <SelectItem value="BTTopUp">Balance Transfer Top-Up</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      Select the type of loan you wish to apply for
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="amount"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Loan Amount (₹)</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="Enter loan amount"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="tenure"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Loan Tenure (months)</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="Enter loan tenure in months"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <FormField
                                control={form.control}
                                name="interestRate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Interest Rate (%)</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="Enter interest rate"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      This is the current rate for {getLoanTypeLabel(loanTypeParam)}. Subject to change based on eligibility.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="purpose"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Loan Purpose</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Briefly describe your purpose for taking this loan"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {(form.watch("loanType") === "HomeLoan" || form.watch("loanType") === "LAP") && (
                                <>
                                  <Separator />
                                  <h3 className="text-lg font-medium">Property Details</h3>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                      control={form.control}
                                      name="propertyValue"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Property Value (₹)</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              placeholder="Enter property value"
                                              {...field}
                                              value={field.value === undefined ? "" : field.value}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  
                                  <FormField
                                    control={form.control}
                                    name="propertyAddress"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Property Address</FormLabel>
                                        <FormControl>
                                          <Textarea
                                            placeholder="Enter complete property address"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </>
                              )}
                              
                              {form.watch("loanType") === "BTTopUp" && (
                                <>
                                  <Separator />
                                  <h3 className="text-lg font-medium">Existing Loan Details</h3>
                                  
                                  <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Important</AlertTitle>
                                    <AlertDescription>
                                      Please provide details of your existing loan that you wish to transfer
                                    </AlertDescription>
                                  </Alert>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <FormLabel>Current Lender Name</FormLabel>
                                      <Input placeholder="Enter your current bank/lender name" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <FormLabel>Current Loan Account Number</FormLabel>
                                      <Input placeholder="Enter your loan account number" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <FormLabel>Outstanding Loan Amount (₹)</FormLabel>
                                      <Input type="number" placeholder="Enter outstanding amount" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <FormLabel>Current Interest Rate (%)</FormLabel>
                                      <Input type="number" step="0.1" placeholder="Enter current interest rate" />
                                    </div>
                                  </div>
                                </>
                              )}
                              
                              <div className="flex justify-end">
                                <Button
                                  type="button"
                                  onClick={() => setActiveTab("personal-details")}
                                >
                                  Continue to Personal Details
                                </Button>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="personal-details" className="mt-6 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="employmentType"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Employment Type</FormLabel>
                                      <Select 
                                        value={field.value} 
                                        onValueChange={field.onChange}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select employment type" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="salaried">Salaried</SelectItem>
                                          <SelectItem value="self-employed">Self-Employed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="monthlyIncome"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Monthly Income (₹)</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="Enter your monthly income"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <Separator />
                              
                              <div className="space-y-4">
                                <h3 className="text-lg font-medium">Required Documents</h3>
                                <p className="text-sm text-neutral-600">
                                  Please ensure you have the following documents ready for upload after submitting your application
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex items-start p-3 border rounded-md">
                                    <FileText className="h-5 w-5 text-primary mt-0.5 mr-2" />
                                    <div>
                                      <p className="font-medium">Identity Proof</p>
                                      <p className="text-sm text-neutral-500">Aadhaar Card, PAN Card</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start p-3 border rounded-md">
                                    <FileText className="h-5 w-5 text-primary mt-0.5 mr-2" />
                                    <div>
                                      <p className="font-medium">Address Proof</p>
                                      <p className="text-sm text-neutral-500">Utility Bills, Passport</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start p-3 border rounded-md">
                                    <FileText className="h-5 w-5 text-primary mt-0.5 mr-2" />
                                    <div>
                                      <p className="font-medium">Income Proof</p>
                                      <p className="text-sm text-neutral-500">Salary Slips, IT Returns</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start p-3 border rounded-md">
                                    <FileText className="h-5 w-5 text-primary mt-0.5 mr-2" />
                                    <div>
                                      <p className="font-medium">Property Documents</p>
                                      <p className="text-sm text-neutral-500">Sale Deed, Property Papers</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setActiveTab("loan-details")}
                                >
                                  Back to Loan Details
                                </Button>
                                <Button 
                                  type="submit"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? "Submitting..." : "Submit Application"}
                                </Button>
                              </div>
                            </TabsContent>
                          </form>
                        </Form>
                      </Tabs>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Loan Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600">Loan Type</span>
                            <span className="font-medium">{getLoanTypeLabel(loanTypeParam)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600">Loan Amount</span>
                            <span className="font-medium">₹{watchAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600">Tenure</span>
                            <span className="font-medium">{watchTenure} months</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600">Interest Rate</span>
                            <span className="font-medium">{watchInterestRate}%</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600">Monthly EMI</span>
                            <span className="font-semibold text-primary">₹{emiAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Eligibility Criteria</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible>
                          <AccordionItem value="age">
                            <AccordionTrigger className="text-sm font-medium">Age Criteria</AccordionTrigger>
                            <AccordionContent className="text-sm text-neutral-600">
                              Applicant must be at least 21 years old and not more than 65 years at loan maturity.
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="income">
                            <AccordionTrigger className="text-sm font-medium">Income Requirements</AccordionTrigger>
                            <AccordionContent className="text-sm text-neutral-600">
                              Minimum income of ₹25,000 per month for salaried individuals and ₹3 lakhs annual income for self-employed.
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="documents">
                            <AccordionTrigger className="text-sm font-medium">Document Requirements</AccordionTrigger>
                            <AccordionContent className="text-sm text-neutral-600">
                              Identity proof, address proof, income proof, and property documents are mandatory.
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="credit">
                            <AccordionTrigger className="text-sm font-medium">Credit Score</AccordionTrigger>
                            <AccordionContent className="text-sm text-neutral-600">
                              A minimum credit score of 700 is recommended for favorable interest rates.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                    
                    <div className="flex items-center justify-center p-4 bg-primary/10 rounded-lg">
                      <Upload className="h-5 w-5 text-primary mr-2" />
                      <p className="text-sm text-primary">You can upload documents after submitting your application</p>
                    </div>
                  </div>
                </div>
                
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Not sure about your loan amount?</CardTitle>
                    <CardDescription>Use our calculator to find the perfect loan for your needs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LoanCalculator onApply={(loanDetails) => {
                      form.setValue("loanType", getLoanTypeFromParam(loanDetails.loanType));
                      form.setValue("amount", loanDetails.amount);
                      form.setValue("interestRate", loanDetails.interestRate);
                      form.setValue("tenure", loanDetails.tenure * 12); // Convert years to months
                    }} />
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-xl border border-neutral-100 bg-neutral-50 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Home className="text-primary text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Home Loans</h3>
                    <p className="text-neutral-600 mb-4">Make your dream home a reality with our competitive interest rates starting from 7.5% p.a.</p>
                  </div>
                  
                  <div className="p-6 rounded-xl border border-neutral-100 bg-neutral-50 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Building className="text-primary text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Loan Against Property</h3>
                    <p className="text-neutral-600 mb-4">Leverage your property to secure funds for business expansion or other major expenses.</p>
                  </div>
                  
                  <div className="p-6 rounded-xl border border-neutral-100 bg-neutral-50 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <ArrowRightLeft className="text-primary text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Balance Transfer</h3>
                    <p className="text-neutral-600 mb-4">Transfer your existing loan and get additional funds at lower interest rates.</p>
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
