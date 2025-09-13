import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../hooks/use-auth";
import { useToast } from "../hooks/use-toast";
import { PaymentGateway } from "../components/ui/payment-gateway";
import { ChatbotButton } from "../components/layout/chatbot-button";
import { LoanCalculator } from "../components/ui/calculator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";
import {
  Home,
  Building,
  ArrowRightLeft,
  AlertCircle,
  Check,
  FileText,
  IndianRupee,
  Loader2,
  XCircle,
  RefreshCw,
  Info
} from "lucide-react";
import { getQueryParam, getLoanTypeLabel, calculateEMI } from "../lib/utils";

// ============================================================================
// 1. CONSTANTS & API LOGIC (Centralized in this file)
// ============================================================================
const BASE_URL = "http://homobie.ap-south-1.elasticbeanstalk.com/register/user";

/**
 * A custom error class for handling API errors in a structured way.
 */
class ApiError extends Error {
  status: number;
  details?: { field: string; message: string }[];
  code?: string;
  eligibility?: string;
  inEligibleResponse?: string[];

  constructor(
    message: string,
    status: number,
    details?: any,
    code?: string,
    eligibility?: string,
    inEligibleResponse?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.code = code;
    this.eligibility = eligibility;
    this.inEligibleResponse = inEligibleResponse;
  }
}

const getToken = (): string => {
  return localStorage.getItem("auth_token") || localStorage.getItem("token") || "";
};

// Alternative syntax - move generic after async
const apiClient = async <T,>(
  endpoint: string,
  method: 'POST',
  body?: any
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw new ApiError(
        errorData.message || `An error occurred (Status: ${response.status})`,
        response.status,
        errorData.details || errorData.errors,
        errorData.code,
        errorData.eligibility,
        errorData.inEligibleResponse
      );
    }

    const text = await response.text();
    return text ? (JSON.parse(text) as T) : ({} as T);

  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Unable to connect to the server. Please check your internet connection and try again.",
      503, // Service Unavailable
      undefined,
      "NETWORK_ERROR"
    );
  }
};


// ============================================================================
// 2. ZOD SCHEMA & TYPES
// ============================================================================
const existingLoanDetailsSchema = z.object({
  currentLender: z.string().min(2, "Current lender name is required"),
  accountNumber: z.string().min(5, "Account number is required"),
  outstandingAmount: z.coerce.number().min(1, "Outstanding amount must be greater than 0"),
  currentInterestRate: z.coerce.number().min(1, "Current interest rate is required"),
  remainingTenure: z.coerce.number().min(1, "Remaining tenure is required"),
  emiAmount: z.coerce.number().min(1, "Current EMI amount is required"),
  loanStartDate: z.string().optional(),
}).optional();

const loanFormSchema = z.object({
  loanType: z.string(),
  amount: z.coerce.number()
    .min(100000, "Loan amount must be at least ₹1,00,000")
    .max(10000000, "Loan amount cannot exceed ₹1,00,00,000"),
  tenure: z.coerce.number()
    .min(1, "Tenure must be at least 1 year")
    .max(30, "Tenure cannot exceed 30 years"),
  interestRate: z.coerce.number()
    .min(5, "Interest rate must be at least 5%")
    .max(20, "Interest rate cannot exceed 20%"),
  monthlyIncome: z.coerce.number()
    .min(10000, "Monthly income must be at least ₹10,000"),
  cibilScore: z.coerce.number()
    .min(300, "CIBIL score must be at least 300")
    .max(900, "CIBIL score cannot exceed 900"),
  age: z.coerce.number()
    .min(21, "Age must be at least 21 years")
    .max(65, "Age cannot exceed 65 years"),
  propertyValue: z.coerce.number().optional(),
  propertyAddressLine1: z.string().optional(),
  propertyAddressLine2: z.string().optional(),
  propertyLandmark: z.string().optional(),
  propertyCity: z.string().optional(),
  propertyState: z.string().optional(),
  propertyPincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits").optional().or(z.literal("")),
  propertyCountry: z.string().optional(),
  purpose: z.string()
    .min(10, "Please provide a detailed purpose for the loan (minimum 10 characters)")
    .max(500, "Purpose cannot exceed 500 characters"),
  employmentType: z.enum(["salaried", "self-employed"], {
    required_error: "Please select your employment type",
  }),
  existingLoanDetails: existingLoanDetailsSchema,
}).refine((data) => {
  if (data.loanType === "HOME_LOAN" || data.loanType === "LAP") {
    return data.propertyValue && data.propertyValue > 0;
  }
  return true;
}, {
  message: "Property value is required for this loan type.",
  path: ["propertyValue"],
}).refine((data) => {
  if (data.loanType === "BT_TOPUP") {
    return data.existingLoanDetails && data.existingLoanDetails.currentLender;
  }
  return true;
}, {
  message: "Existing loan details are required for Balance Transfer.",
  path: ["existingLoanDetails", "currentLender"],
});

type LoanFormValues = z.infer<typeof loanFormSchema>;

// Auth Helper
const getUserId = () => {
  const authUser = localStorage.getItem("auth_user");
  return authUser ? JSON.parse(authUser)?.userId : null;
};

// ============================================================================
// 3. HELPER COMPONENTS (Co-located in this file)
// ============================================================================

const FormError = ({ error, onRetry, isRetrying }: { error: ApiError | null; onRetry: () => void; isRetrying: boolean }) => {
  if (!error) return null;

  const isRetryable = error.status === 503 || error.code === "NETWORK_ERROR";
  const isEligibilityError = error.eligibility === "ineligible";

  return (
    <Alert variant="destructive" className="mb-6 bg-red-900/30 border-red-700">
      <XCircle className="h-4 w-4" />
      <AlertTitle className="text-red-200">{isEligibilityError ? "Application Ineligible" : "Submission Failed"}</AlertTitle>
      <AlertDescription className="space-y-2 text-red-100">
        <p>{error.message}</p>
        {isEligibilityError && error.inEligibleResponse && (
          <ul className="list-disc pl-5 mt-2 text-xs">
            {error.inEligibleResponse.map((reason, i) => <li key={i}>{reason}</li>)}
          </ul>
        )}
        {isRetryable && (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={onRetry} disabled={isRetrying} className="bg-red-800/50 border-red-600 text-white hover:bg-red-700">
              {isRetrying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              {isRetrying ? "Retrying..." : "Retry"}
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

const SubmissionSuccess = ({ submittedData }: { submittedData: any }) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  return (
    <div className="space-y-8">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-8 text-center">
          <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Application Submitted!</h2>
          <p className="text-gray-300 mb-6">
            Your application (ID: <span className="font-medium text-white">{submittedData?.id || 'N/A'}</span>) has been received.
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white"></CardTitle>
          <CardDescription className="font-bold mb-3 text-center text-gray-300">Our team will get in touch with you soon</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <PaymentGateway
            paymentType="loan-processing-fee"
            itemId={submittedData?.id}
            buttonText="Pay Processing Fee"
            description="Pay to complete your loan application"
            onSuccess={() => toast({ title: "Payment Successful!", description: "Your application is now being processed." })}
            onFailure={(err) => toast({ title: "Payment Failed", description: err?.message || "An unknown error occurred.", variant: "destructive" })}
          /> */}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/")} className="bg-transparent text-white border-gray-600 hover:bg-gray-700">Back to Home</Button>
          <Button onClick={() => navigate("/dashboard")} className="bg-blue-600 hover:bg-blue-700">Go to Dashboard</Button>
        </CardFooter>
      </Card>
    </div>
  );
};


interface LoanApplicationFormProps {
  form: UseFormReturn<LoanFormValues>;
  onSubmit: (data: LoanFormValues) => void;
  isSubmitting: boolean;
}

const LoanApplicationForm = ({ form, onSubmit, isSubmitting }: LoanApplicationFormProps) => {
  const [activeTab, setActiveTab] = useState("loan-details");
  const loanTypeParam = getQueryParam("type") || "home-loan";

  const watchAmount = form.watch("amount");
  const watchTenure = form.watch("tenure");
  const watchInterestRate = form.watch("interestRate");
  const emiAmount = calculateEMI(Number(watchAmount), Number(watchInterestRate), Number(watchTenure));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="md:col-span-2 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Loan Application Form</CardTitle>
          <CardDescription className="text-gray-400">Fill in all required information to submit your application.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900 p-1">
              <TabsTrigger 
                value="loan-details" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                Loan Details
              </TabsTrigger>
              <TabsTrigger 
                value="personal-details" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                Personal & Financial
              </TabsTrigger>
            </TabsList>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                <TabsContent value="loan-details" className="space-y-6">
                   <FormField
                    control={form.control}
                    name="loanType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Loan Type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select loan type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="HOME_LOAN">Home Loan</SelectItem>
                            <SelectItem value="LAP">Loan Against Property</SelectItem>
                            <SelectItem value="BT_TOPUP">Balance Transfer Top-Up</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-400">
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
                          <FormLabel className="text-white">Loan Amount (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter loan amount"
                              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Minimum: ₹1,00,000 | Maximum: ₹1,00,00,000
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tenure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Loan Tenure (Years)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="30"
                              placeholder="Enter loan tenure in years"
                              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Duration in years (1-30 years)
                          </FormDescription>
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
                        <FormLabel className="text-white">Interest Rate (% per annum)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="5"
                            max="20"
                            placeholder="Enter interest rate"
                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Current rate for {getLoanTypeLabel(loanTypeParam)}. Final rate subject to eligibility.
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
                        <FormLabel className="text-white">Loan Purpose <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide a detailed description of your purpose for taking this loan (minimum 10 characters)"
                            className="min-h-[100px] bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Be specific about how you plan to use the loan amount
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(form.watch("loanType") === "HOME_LOAN" || form.watch("loanType") === "LAP") && (
                    <>
                      <Separator className="bg-gray-700" />
                      <h3 className="text-lg font-medium flex items-center pt-2 text-white">
                        <Building className="h-5 w-5 mr-2 text-blue-400" />
                        Property Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="propertyValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Property Value (₹) <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter estimated property value"
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                          control={form.control}
                          name="propertyAddressLine1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Address Line 1</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="House/Flat number, Street name, Area" 
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="propertyAddressLine2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Address Line 2 (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Apartment, suite, unit, building, floor" 
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="propertyLandmark" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Landmark</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nearby prominent location" 
                                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="propertyCity" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">City</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="City name" 
                                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="propertyState" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">State</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="State name" 
                                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="propertyPincode" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Pincode</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="6-digit postal code" 
                                maxLength={6} 
                                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </>
                  )}

                  {form.watch("loanType") === "BT_TOPUP" && (
                    <>
                      <Separator className="bg-gray-700" />
                      <h3 className="text-lg font-medium flex items-center pt-2 text-white">
                        <ArrowRightLeft className="h-5 w-5 mr-2 text-blue-400" />
                        Existing Loan Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="existingLoanDetails.currentLender" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Current Lender Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your current bank/lender name" 
                                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="existingLoanDetails.accountNumber" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Loan Account Number <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your loan account number" 
                                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="existingLoanDetails.outstandingAmount" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Outstanding Amount (₹) <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Enter current outstanding amount" 
                                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="existingLoanDetails.currentInterestRate" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Current Interest Rate (%) <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.1" 
                                placeholder="Enter current interest rate" 
                                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="existingLoanDetails.remainingTenure" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Remaining Tenure (Months) <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Enter remaining tenure" 
                                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="existingLoanDetails.emiAmount" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Current EMI Amount (₹) <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Enter current EMI amount" 
                                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab('personal-details')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next: Personal Details
                      <ArrowRightLeft className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="personal-details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="employmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Employment Type</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Select employment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              <SelectItem value="salaried">Salaried Employee</SelectItem>
                              <SelectItem value="self-employed">Self-Employed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="monthlyIncome" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Monthly Income (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter your monthly income" 
                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="cibilScore" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">CIBIL Score</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="300" 
                            max="900" 
                            placeholder="Enter your CIBIL score (300-900)" 
                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="age" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Age (Years)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="21" 
                            max="65" 
                            placeholder="Enter your age" 
                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <Separator className="bg-gray-700" />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center text-white">
                      <FileText className="h-5 w-5 mr-2 text-blue-400" />
                      Required Documents (For Reference)
                    </h3>
                     <p className="text-sm text-gray-400">Please ensure you have the following documents ready when our representative contacts you.</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="flex items-start p-3 border rounded-md bg-blue-900/20 border-blue-700/30">
                         <FileText className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                         <div>
                           <p className="font-medium text-white">Identity Proof</p>
                           <p className="text-sm text-gray-400">Aadhaar Card, PAN Card</p>
                         </div>
                       </div>
                       <div className="flex items-start p-3 border rounded-md bg-green-900/20 border-green-700/30">
                         <FileText className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                         <div>
                           <p className="font-medium text-white">Address Proof</p>
                           <p className="text-sm text-gray-400">Utility Bills, Bank Statement</p>
                         </div>
                       </div>
                       <div className="flex items-start p-3 border rounded-md bg-yellow-900/20 border-yellow-700/30">
                         <FileText className="h-5 w-5 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                         <div>
                           <p className="font-medium text-white">Income Proof</p>
                           <p className="text-sm text-gray-400">Salary Slips, IT Returns</p>
                         </div>
                       </div>
                       <div className="flex items-start p-3 border rounded-md bg-purple-900/20 border-purple-700/30">
                         <FileText className="h-5 w-5 text-purple-400 mt-0.5 mr-2 flex-shrink-0" />
                         <div>
                           <p className="font-medium text-white">Property Documents</p>
                           <p className="text-sm text-gray-400">Sale Deed, Property Papers</p>
                         </div>
                       </div>
                     </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab("loan-details")}
                      className="bg-transparent text-white border-gray-600 hover:bg-gray-700"
                    >
                      Back to Loan Details
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="min-w-[180px] bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                        </>
                      ) : "Submit Application"}
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card className="bg-blue-900/20 border-blue-700/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-white">
                <IndianRupee className="h-5 w-5 mr-2 text-blue-400" />
                Loan Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Loan Type</span>
                      <span className="font-medium text-white">{getLoanTypeLabel(loanTypeParam)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Loan Amount</span>
                      <span className="font-medium text-white">₹{watchAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Tenure</span>
                      <span className="font-medium text-white">{watchTenure} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Interest Rate</span>
                      <span className="font-medium text-white">{watchInterestRate}% p.a.</span>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Estimated Monthly EMI</span>
                      <span className="font-semibold text-blue-400 text-lg">₹{emiAmount.toLocaleString()}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Eligibility Criteria</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="age" className="border-b border-gray-700">
                      <AccordionTrigger className="text-sm font-medium text-white hover:text-gray-300 py-2">
                        Age Criteria
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-400 pt-1">
                        Applicant must be between 21 and 65 years old.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="income" className="border-b border-gray-700">
                      <AccordionTrigger className="text-sm font-medium text-white hover:text-gray-300 py-2">
                        Income Requirements
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-400 pt-1">
                        Minimum monthly income of ₹25,000 for salaried and ₹3 lakhs annual for self-employed.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="credit">
                      <AccordionTrigger className="text-sm font-medium text-white hover:text-gray-300 py-2">
                        Credit Score
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-400 pt-1">
                        A minimum credit score of 700 is recommended.
                      </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};


// ============================================================================
// 5. MAIN PAGE COMPONENT (Orchestrator)
// ============================================================================
export default function LoanApplicationPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const loanTypeParam = getQueryParam("type") || "home-loan";

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      loanType: loanTypeParam === "lap" ? "LAP" : loanTypeParam === "bt-topup" ? "BT_TOPUP" : "HOME_LOAN",
      amount: 2500000,
      tenure: 20,
      interestRate: 8.5,
      monthlyIncome: 50000,
      cibilScore: 750,
      age: 30,
      purpose: "",
      employmentType: "salaried",
    },
  });

  const loanApplicationMutation = useMutation({
    mutationFn: (data: LoanFormValues) => {
      const userId = getUserId();
      if (!userId) {
        throw new ApiError("Authentication required. Please log in to continue.", 401, undefined, "AUTH_REQUIRED");
      }

      const payload = {
        userId,
        loanType: data.loanType,
        amount: Number(data.amount),
        tenure: Number(data.tenure) * 12, // Convert years to months
        interestRate: Number(data.interestRate),
        purpose: data.purpose.trim(),
        collateral: (data.loanType === "HOME_LOAN" || data.loanType === "LAP") ? {
          propertyValue: Number(data.propertyValue),
          propertyAddress: {
            addressLine1: data.propertyAddressLine1?.trim() || "",
            addressLine2: data.propertyAddressLine2?.trim() || "",
            landmark: data.propertyLandmark?.trim() || "",
            city: data.propertyCity?.trim() || "",
            state: data.propertyState?.trim() || "",
            pincode: data.propertyPincode?.trim() || "",
            country: data.propertyCountry?.trim() || "India"
          }
        } : undefined,
        applicantProfile: {
          monthlyIncome: Number(data.monthlyIncome),
          cibilScore: Number(data.cibilScore),
          age: Number(data.age),
          employmentType: data.employmentType.toUpperCase(),
          existingLoanDetails: data.loanType === "BT_TOPUP" && data.existingLoanDetails ? {
            ...data.existingLoanDetails,
            outstandingAmount: Number(data.existingLoanDetails.outstandingAmount),
            currentInterestRate: Number(data.existingLoanDetails.currentInterestRate),
            remainingTenure: Number(data.existingLoanDetails.remainingTenure),
            emiAmount: Number(data.existingLoanDetails.emiAmount)
          } : "None"
        }
      };
      
      return apiClient<any>('/loan/add', 'POST', payload);
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      setSubmittedData(data);
      setError(null);
      toast({
        title: "Success!",
        description: data.message || "Your loan application has been submitted successfully.",
      });
    },
    onError: (err: unknown) => {
      const apiError = err as ApiError;
      form.clearErrors();

      if ((apiError.status === 400 || apiError.status === 422) && Array.isArray(apiError.details)) {
        apiError.details.forEach((fieldError: any) => {
          const fieldName = (fieldError.path?.[0] || fieldError.field) as keyof LoanFormValues;
          if (fieldName && typeof fieldName === 'string') {
            form.setError(fieldName, { type: 'server', message: fieldError.message });
          }
        });
        toast({
          title: "Validation Error",
          description: "Please check the errors highlighted in the form and try again.",
          variant: "destructive",
        });
        setError(null);
      } else {
        setError(apiError);
        toast({
          title: apiError.eligibility === 'ineligible' ? "Application Not Eligible" : "Submission Failed",
          description: apiError.message,
          variant: "destructive",
          duration: 8000
        });
      }

      if (apiError.status === 401) {
        setTimeout(() => navigate('/auth'), 2000);
      }
    },
  });

  const onSubmit = (data: LoanFormValues) => {
    setError(null);
    loanApplicationMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {isSuccess ? (
              <SubmissionSuccess submittedData={submittedData} />
            ) : (
              <div className="space-y-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {getLoanTypeLabel(loanTypeParam)} Application
                  </h1>
                  <p className="text-gray-400">
                    Complete the form below to apply for your {getLoanTypeLabel(loanTypeParam.toLowerCase())}
                  </p>
                </div>

                <FormError
                  error={error}
                  onRetry={() => onSubmit(form.getValues())}
                  isRetrying={loanApplicationMutation.isPending}
                />

                <LoanApplicationForm
                  form={form}
                  onSubmit={onSubmit}
                  isSubmitting={loanApplicationMutation.isPending}
                />
                <Card className="mb-8 bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Not sure about your loan amount?</CardTitle>
                    <CardDescription className="text-gray-400">Use our calculator to find the perfect loan for your needs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LoanCalculator onApply={(loanDetails) => {
                      form.setValue("loanType", loanDetails.loanType);
                      form.setValue("amount", loanDetails.amount);
                      form.setValue("interestRate", loanDetails.interestRate);
                      form.setValue("tenure", loanDetails.tenure);
                    }} />
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-xl border border-gray-700 bg-gray-800 hover:shadow-lg transition-shadow hover:border-blue-500/30">
                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
                      <Home className="text-blue-400 text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Home Loans</h3>
                    <p className="text-gray-400 mb-4">Make your dream home a reality with our competitive interest rates starting from 7.5% p.a.</p>
                  </div>
                  
                  <div className="p-6 rounded-xl border border-gray-700 bg-gray-800 hover:shadow-lg transition-shadow hover:border-blue-500/30">
                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
                      <Building className="text-blue-400 text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Loan Against Property</h3>
                    <p className="text-gray-400 mb-4">Leverage your property to secure funds for business expansion or other major expenses.</p>
                  </div>
                  
                  <div className="p-6 rounded-xl border border-gray-700 bg-gray-800 hover:shadow-lg transition-shadow hover:border-blue-500/30">
                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
                      <ArrowRightLeft className="text-blue-400 text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Balance Transfer</h3>
                    <p className="text-gray-400 mb-4">Transfer your existing loan and get additional funds at lower interest rates.</p>
                  </div>
                </div>
              </div>
      
            )}
          </div>
        </div>
      </main>
      <ChatbotButton />
    </div>
  );
}
