import React, { useState } from "react"; 
import { useLocation, Link } from "wouter"; 
import { useForm } from "react-hook-form"; 
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
  Upload, 
  DollarSign 
} from "lucide-react"; 
import { getQueryParam, getLoanTypeLabel, calculateEMI } from "../lib/utils"; 

const BASE_URL = "https://homobiebackend-railway-production.up.railway.app";

// Helper functions for auth
const getAuthUser = () => {
  try {
    const authUser = localStorage.getItem("auth_user");
    if (!authUser) return null;
    return JSON.parse(authUser);
  } catch (error) {
    console.error("Error parsing auth_user from localStorage:", error);
    return null;
  }
};

const getUserId = () => {
  const authUser = getAuthUser();
  return authUser?.userId || null;
};

const getToken = () => {
  const token = localStorage.getItem("auth_token") || localStorage.getItem("token") || "";
  return token;
};

// Form Schema
const loanFormSchema = z.object({
  loanType: z.string(),
  amount: z.coerce.number().min(100000, "Loan amount must be at least ₹1,00,000").max(10000000, "Loan amount cannot exceed ₹1,00,00,000"),
  tenure: z.coerce.number().min(12, "Tenure must be at least 12 months").max(360, "Tenure cannot exceed 360 months"),
  interestRate: z.coerce.number().min(5, "Interest rate must be at least 5%").max(20, "Interest rate cannot exceed 20%"),
  monthlyIncome: z.coerce.number().min(10000, "Monthly income must be at least ₹10,000"),
  cibilScore: z.coerce.number().min(300, "CIBIL score must be at least 300").max(900, "CIBIL score cannot exceed 900"),
  age: z.coerce.number().min(21, "Age must be at least 21 years").max(65, "Age cannot exceed 65 years"),
  propertyValue: z.coerce.number().optional(),
  propertyAddressLine1: z.string().optional(),
  propertyAddressLine2: z.string().optional(),
  propertyLandmark: z.string().optional(),
  propertyCity: z.string().optional(),
  propertyState: z.string().optional(),
  propertyPincode: z.string().optional(),
  propertyCountry: z.string().optional(),
  purpose: z.string().min(5, "Please provide a brief purpose for the loan").max(500, "Purpose cannot exceed 500 characters"),
  employmentType: z.enum(["salaried", "self-employed"], {
    required_error: "Please select your employment type",
  }),
  existingLoanDetails: z.any().optional(),
});

type LoanFormValues = z.infer<typeof loanFormSchema>;

export default function LoanApplicationPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("loan-details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [documentUploadVisible, setDocumentUploadVisible] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const loanTypeParam = getQueryParam("type") || "home-loan";
  
  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      loanType: getLoanTypeFromParam(loanTypeParam),
      amount: Number(getQueryParam("amount")) || 2500000,
      tenure: Number(getQueryParam("tenure")) || 240,
      interestRate: Number(getQueryParam("interestRate")) || getLoanTypeDefaultRate(loanTypeParam),
      propertyValue: undefined,
      propertyAddressLine1: "",
      propertyAddressLine2: "",
      propertyLandmark: "",
      propertyCity: "",
      propertyState: "",
      propertyPincode: "",
      propertyCountry: "India",
      purpose: "",
      monthlyIncome: 0,
      cibilScore: 750,
      age: 30,
      employmentType: "salaried",
      existingLoanDetails: loanTypeParam === "bt-topup" ? {} : undefined,
    },
  });

  function getLoanTypeFromParam(param: string): string {
    switch (param) {
      case "home-loan": return "HOME_LOAN";
      case "lap": return "LAP";
      case "bt-topup": return "BT_TOPUP";
      default: return "HOME_LOAN";
    }
  }

  function getLoanTypeDefaultRate(param: string): number {
    switch (param) {
      case "home-loan": return 8.5;
      case "lap": return 9.5;
      case "bt-topup": return 8.0;
      default: return 8.5;
    }
  }

  const { toast } = useToast();
  const [submittedData, setSubmittedData] = useState<any>(null);
  
  const submitLoanApplication = async (data: LoanFormValues) => {
    setApiError(null);
    const startTime = performance.now();
    
    try {
      const userId = getUserId();
      const token = getToken();

      if (!userId || !token) {
        throw new Error("Authentication required. Please login again.");
      }

      const payload = {
        userId: userId,
        loanType: data.loanType,
        amount: data.amount,
        tenure: data.tenure,
        interestRate: data.interestRate,
        purpose: data.purpose,
        collateral: (data.loanType === "HOME_LOAN" || data.loanType === "LAP") ? {
          propertyValue: data.propertyValue,
          propertyAddress: {
            addressLine1: data.propertyAddressLine1 || "",
            addressLine2: data.propertyAddressLine2 || "",
            landmark: data.propertyLandmark || "",
            city: data.propertyCity || "",
            state: data.propertyState || "",
            pincode: data.propertyPincode || "",
            country: data.propertyCountry || "India"
          }
        } : undefined,
        applicantProfile: {
          monthlyIncome: data.monthlyIncome,
          cibilScore: data.cibilScore,
          age: data.age,
          employmentType: data.employmentType.toUpperCase(),
          existingLoanDetails: data.existingLoanDetails || "None"
        }
      };

      console.log("Submitting payload:", payload);

      const response = await fetch(`${BASE_URL}/loan/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const endTime = performance.now();
      console.log(`API call took ${endTime - startTime}ms`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      if (error instanceof Error) {
        setApiError(error.message);
        if (error.message.includes("Authentication required")) {
          navigate("/auth");
        }
      }
      throw error;
    }
  };

  const { mutateAsync: createLoan } = useMutation({
    mutationFn: submitLoanApplication,
    onSuccess: (data) => {
      setSubmittedData(data);
      setIsSuccess(true);
      setDocumentUploadVisible(true);
      toast({
        title: "Success",
        description: "Loan application submitted successfully!",
      });
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = async (data: LoanFormValues) => {
    console.log("Form data being submitted:", data);
    
    const userId = getUserId();
    const token = getToken();
    
    if (!userId || !token) {
      toast({
        title: "Authentication Error",
        description: "Please login to submit a loan application",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    try {
      setIsSubmitting(true);
      await createLoan(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  function handleDocumentUpload(files: FileList) {
    console.log("Files uploaded:", files);
    // Implement document upload logic here
  }

  const watchAmount = form.watch("amount");
  const watchTenure = form.watch("tenure");
  const watchInterestRate = form.watch("interestRate");
  
  const emiAmount = calculateEMI(
    Number(watchAmount),
    Number(watchInterestRate),
    Number(watchTenure) / 12
  );

  return (
    <div>
      <main className="bg-black py-12 pt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {isSuccess ? (
              <div className="space-y-8">
                <Card className="mb-8">
                  <CardContent className="pt-6 pb-8 text-center">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Application Submitted Successfully!</h2>
                    <p className="text-white mb-4">
                      Your loan application has been submitted. Application ID: <span className="font-medium">{submittedData?.id}</span>
                    </p>
                    <p className="text-white mb-6">
                      To proceed with your application, please complete the processing fee payment.
                    </p>
                  </CardContent>
                </Card>
                
                {documentUploadVisible && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Required Documents</CardTitle>
                      <CardDescription>
                        Please upload all required documents to complete your application
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <Upload className="h-10 w-10 text-white mb-4" />
                        <p className="text-sm text-white mb-4">
                          Drag and drop your documents here, or click to browse
                        </p>
                        <input
                          type="file"
                          id="document-upload"
                          multiple
                          onChange={(e) => e.target.files && handleDocumentUpload(e.target.files)}
                          className="hidden"
                        />
                        <Button asChild>
                          <label htmlFor="document-upload" className="cursor-pointer">
                            Select Files
                          </label>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {getLoanTypeLabel(loanTypeParam)} Application
                  </h1>
                  <p className="text-white">
                    Complete the form below to apply for your {getLoanTypeLabel(loanTypeParam.toLowerCase())}
                  </p>
                </div>
        
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 bg-black dark:bg-neutral-900/80 backdrop-blur-sm">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Loan Application Form</CardTitle>
                      <CardDescription>
                        Fill in all required information to submit your application
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                          <TabsTrigger value="loan-details">Loan Details</TabsTrigger>
                          <TabsTrigger value="personal-details">Personal Details</TabsTrigger>
                        </TabsList>
                        
                        <Form {...form}>
  <form
    onSubmit={form.handleSubmit(onSubmit)}
    className="space-y-6 bg-black text-white border border-white p-6 rounded-md"
  >
    {/* Loan Details Tab */}
    <TabsContent value="loan-details" className="mt-6 space-y-6">
      <FormField
        control={form.control}
        name="loanType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Loan Type</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="bg-black text-white border border-white">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-black text-white border border-white">
                <SelectItem value="HOME_LOAN">Home Loan</SelectItem>
                <SelectItem value="LAP">Loan Against Property</SelectItem>
                <SelectItem value="BT_TOPUP">Balance Transfer Top-Up</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-gray-300">
              Select the type of loan you wish to apply for
            </FormDescription>
            <FormMessage className="text-red-400" />
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
                  {...field}
                  className="bg-black text-white border border-white placeholder-gray-400"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tenure"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Loan Tenure (months)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter loan tenure in months"
                  {...field}
                  className="bg-black text-white border border-white placeholder-gray-400"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="interestRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Interest Rate (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.1"
                placeholder="Enter interest rate"
                {...field}
                className="bg-black text-white border border-white placeholder-gray-400"
              />
            </FormControl>
            <FormDescription className="text-gray-300">
              This is the current rate for {getLoanTypeLabel(loanTypeParam)}. Subject to change based on eligibility.
            </FormDescription>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Loan Purpose</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Briefly describe your purpose for taking this loan"
                {...field}
                className="bg-black text-white border border-white placeholder-gray-400"
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

      {/* Property Details */}
      {(form.watch("loanType") === "HOME_LOAN" || form.watch("loanType") === "LAP") && (
        <>
          <Separator />
          <h3 className="text-lg font-medium text-white">Property Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="propertyValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Property Value (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter property value"
                      {...field}
                      value={field.value === undefined ? "" : field.value}
                      className="bg-black text-white border border-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="propertyAddressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Address Line 1</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Street address, P.O. box"
                      {...field}
                      className="bg-black text-white border border-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyAddressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Address Line 2</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apartment, suite, unit, building"
                      {...field}
                      className="bg-black text-white border border-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="propertyLandmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Landmark</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nearby prominent location"
                        {...field}
                        className="bg-black text-white border border-white placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City"
                        {...field}
                        className="bg-black text-white border border-white placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="propertyState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">State</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="State"
                        {...field}
                        className="bg-black text-white border border-white placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyPincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Pincode</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Postal code"
                        {...field}
                        className="bg-black text-white border border-white placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="propertyCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Country"
                      {...field}
                      value={field.value || "India"}
                      className="bg-black text-white border border-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>
        </>
      )}

      {/* Balance Transfer Top-Up */}
      {form.watch("loanType") === "BT_TOPUP" && (
        <>
          <Separator />
          <h3 className="text-lg font-medium text-white">Existing Loan Details</h3>

          <Alert className="bg-black border border-white text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Please provide details of your existing loan that you wish to transfer
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FormLabel className="text-white">Current Lender Name</FormLabel>
              <Input
                placeholder="Enter your current bank/lender name"
                className="bg-black text-white border border-white placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <FormLabel className="text-white">Current Loan Account Number</FormLabel>
              <Input
                placeholder="Enter your loan account number"
                className="bg-black text-white border border-white placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <FormLabel className="text-white">Outstanding Loan Amount (₹)</FormLabel>
              <Input
                type="number"
                placeholder="Enter outstanding amount"
                className="bg-black text-white border border-white placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <FormLabel className="text-white">Current Interest Rate (%)</FormLabel>
              <Input
                type="number"
                step="0.1"
                placeholder="Enter current interest rate"
                className="bg-black text-white border border-white placeholder-gray-400"
              />
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => setActiveTab("personal-details")}
          className="border border-white text-white"
        >
          Continue to Personal Details
        </Button>
      </div>
    </TabsContent>

    {/* Personal Details Tab */}
    <TabsContent value="personal-details" className="mt-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="employmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Employment Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="bg-black text-white border border-white">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-black text-white border border-white">
                  <SelectItem value="salaried">Salaried</SelectItem>
                  <SelectItem value="self-employed">Self-Employed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monthlyIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Monthly Income (₹)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter your monthly income"
                  {...field}
                  className="bg-black text-white border border-white placeholder-gray-400"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="cibilScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">CIBIL Score</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter your CIBIL score (300-900)"
                  {...field}
                  className="bg-black text-white border border-white placeholder-gray-400"
                />
              </FormControl>
              <FormDescription className="text-gray-300">
                Your credit score affects your loan eligibility
              </FormDescription>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  {...field}
                  className="bg-black text-white border border-white placeholder-gray-400"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Required Documents</h3>
        <p className="text-sm text-gray-300">
          Please ensure you have the following documents ready for upload after submitting your application
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start p-3 border border-white rounded-md">
            <FileText className="h-5 w-5 text-white mt-0.5 mr-2" />
            <div>
              <p className="font-medium text-white">Identity Proof</p>
              <p className="text-sm text-gray-300">Aadhaar Card, PAN Card</p>
            </div>
          </div>

          <div className="flex items-start p-3 border border-white rounded-md">
            <FileText className="h-5 w-5 text-white mt-0.5 mr-2" />
            <div>
              <p className="font-medium text-white">Address Proof</p>
              <p className="text-sm text-gray-300">Utility Bills, Passport</p>
            </div>
          </div>

          <div className="flex items-start p-3 border border-white rounded-md">
            <FileText className="h-5 w-5 text-white mt-0.5 mr-2" />
            <div>
              <p className="font-medium text-white">Income Proof</p>
              <p className="text-sm text-gray-300">Salary Slips, IT Returns</p>
            </div>
          </div>

          <div className="flex items-start p-3 border border-white rounded-md">
            <FileText className="h-5 w-5 text-white mt-0.5 mr-2" />
            <div>
              <p className="font-medium text-white">Property Documents</p>
              <p className="text-sm text-gray-300">Sale Deed, Property Papers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => setActiveTab("loan-details")}
          className="border border-white text-white bg-black mr-1 w-25 text-[12px]"
        >
          Back to Loan Details
        </Button>

        <div className="flex items-center gap-4">
          <input
            type="file"
            id="document-upload"
            multiple
            onChange={(e) => e.target.files && handleDocumentUpload(e.target.files)}
            className="hidden"
          />
          <Button type="button" variant="outline" asChild className=" bg-black border border-white text-white w-26 text-[13px]">
            <label htmlFor="document-upload" className="cursor-pointer">
              <Upload className="h-4 w-4" />
              Upload Documents
            </label>
          </Button>

          <Button type="submit" disabled={isSubmitting} className="border  border-white text-white">
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </TabsContent>
  </form>
</Form>

                      </Tabs>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-6">
                    <Card className="bg-black border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-white">Loan Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-white">Loan Type</span>
                            <span className="font-medium">{getLoanTypeLabel(loanTypeParam)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-white">Loan Amount</span>
                            <span className="font-medium">₹{watchAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-white">Tenure</span>
                            <span className="font-medium">{watchTenure} months</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-white">Interest Rate</span>
                            <span className="font-medium">{watchInterestRate}%</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-sm text-white">Monthly EMI</span>
                            <span className="font-semibold text-[#FF7F50]">₹{emiAmount.toLocaleString()}</span>
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
                            <AccordionContent className="text-sm text-white">
                              Applicant must be at least 21 years old and not more than 65 years at loan maturity.
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="income">
                            <AccordionTrigger className="text-sm font-medium">Income Requirements</AccordionTrigger>
                            <AccordionContent className="text-sm text-white">
                              Minimum income of ₹25,000 per month for salaried individuals and ₹3 lakhs annual income for self-employed.
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="documents">
                            <AccordionTrigger className="text-sm font-medium">Document Requirements</AccordionTrigger>
                            <AccordionContent className="text-sm text-white">
                              Identity proof, address proof, income proof, and property documents are mandatory.
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="credit">
                            <AccordionTrigger className="text-sm font-medium">Credit Score</AccordionTrigger>
                            <AccordionContent className="text-sm text-white">
                              A minimum credit score of 700 is recommended for favorable interest rates.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                    
                    <div className="flex items-center justify-center p-4 bg-black rounded-lg">
                      <Upload className="h-10 w-10 text-white mr-2" />
                      <p className="text-sm text-white">You can upload documents after submitting your application</p>
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
                      form.setValue("tenure", loanDetails.tenure * 12);
                    }} />
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                  <div className="p-6 rounded-xl border border-neutral-100  hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4 ">
                      <Home className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Home Loans</h3>
                    <p className=" mb-4">Make your dream home a reality with our competitive interest rates starting from 7.5% p.a.</p>
                  </div>
                  
                  <div className="p-6 rounded-xl border border-neutral-100  hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4">
                      <Building className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Loan Against Property</h3>
                    <p className="text-white mb-4">Leverage your property to secure funds for business expansion or other major expenses.</p>
                  </div>
                  
                  <div className="p-6 rounded-xl border border-neutral-100  hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4">
                      <ArrowRightLeft className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Balance Transfer</h3>
                    <p className="text-white mb-4">Transfer your existing loan and get additional funds at lower interest rates.</p>
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