import React, { useState, useEffect } from "react";
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
import { Country, State, City } from "country-state-city";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
  Info,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
} from "lucide-react";
import { getQueryParam, getLoanTypeLabel, calculateEMI } from "../lib/utils";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/register/user`;

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
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.code = code;
    this.eligibility = eligibility;
    this.inEligibleResponse = inEligibleResponse;
  }
}

const getToken = (): string => {
  return (
    localStorage.getItem("auth_token") || localStorage.getItem("token") || ""
  );
};

const apiClient = async (endpoint, method = "POST", body) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
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
      503,
      undefined,
      "NETWORK_ERROR"
    );
  }
};

const existingLoanDetailsSchema = z
  .object({
    currentLender: z.string().min(2, "Current lender name is required"),
    accountNumber: z.string().min(5, "Account number is required"),
    outstandingAmount: z.coerce
      .number()
      .min(1, "Outstanding amount must be greater than 0"),
    currentInterestRate: z.coerce
      .number()
      .min(1, "Current interest rate is required"),
    remainingTenure: z.coerce.number().min(1, "Remaining tenure is required"),
    emiAmount: z.coerce.number().min(1, "Current EMI amount is required"),
    loanStartDate: z.string().optional(),
  })
  .optional();

const loanFormSchema = z
  .object({
    loanType: z.string(),
    amount: z.coerce
      .number()
      .min(100000, "Loan amount must be at least ₹1,00,000")
      .max(10000000, "Loan amount cannot exceed ₹1,00,00,000"),
    tenure: z.coerce
      .number()
      .min(1, "Tenure must be at least 1 year")
      .max(30, "Tenure cannot exceed 30 years"),
    interestRate: z.coerce
      .number()
      .min(5, "Interest rate must be at least 5%")
      .max(20, "Interest rate cannot exceed 20%"),
    monthlyIncome: z.coerce
      .number()
      .min(10000, "Monthly income must be at least ₹10,000"),
    cibilScore: z.coerce
      .number()
      .min(300, "CIBIL score must be at least 300")
      .max(900, "CIBIL score cannot exceed 900"),
    age: z.coerce
      .number()
      .min(21, "Age must be at least 21 years")
      .max(65, "Age cannot exceed 65 years"),
    propertyValue: z.coerce.number().optional(),
    propertyAddressLine1: z.string().optional(),
    propertyAddressLine2: z.string().optional(),
    propertyLandmark: z.string().optional(),
    propertyCity: z.string().optional(),
    propertyState: z.string().optional(),
    propertyPincode: z
      .string()
      .regex(/^\d{6}$/, "Pincode must be 6 digits")
      .optional()
      .or(z.literal("")),
    propertyCountry: z.string().optional(),
    purpose: z
      .string()
      .min(10, "Please provide a detailed purpose (minimum 10 characters)")
      .max(500, "Purpose cannot exceed 500 characters"),
    employmentType: z.enum(["salaried", "self-employed"], {
      required_error: "Please select your employment type",
    }),
    existingLoanDetails: existingLoanDetailsSchema,
  })
  .refine(
    (data) => {
      if (data.loanType === "HOME_LOAN" || data.loanType === "LAP") {
        return data.propertyValue && data.propertyValue > 0;
      }
      return true;
    },
    {
      message: "Property value is required for this loan type.",
      path: ["propertyValue"],
    }
  );

type LoanFormValues = z.infer<typeof loanFormSchema>;

const getUserId = () => {
  const authUser = localStorage.getItem("auth_user");
  return authUser ? JSON.parse(authUser)?.userId : null;
};

const getLoanTypeFromParam = (loanType: string) => {
  switch (loanType) {
    case "lap":
      return "LAP";
    case "bt-topup":
      return "BT_TOPUP";
    default:
      return "HOME_LOAN";
  }
};

const FormError = ({
  error,
  onRetry,
  isRetrying,
}: {
  error: ApiError | null;
  onRetry: () => void;
  isRetrying: boolean;
}) => {
  if (!error) return null;

  const isRetryable = error.status === 503 || error.code === "NETWORK_ERROR";
  const isEligibilityError = error.eligibility === "ineligible";

  return (
    <Alert variant="destructive" className="mb-6">
      <XCircle className="h-4 w-4" />
      <AlertTitle>
        {isEligibilityError ? "Application Ineligible" : "Submission Failed"}
      </AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{error.message}</p>
        {isEligibilityError && error.inEligibleResponse && (
          <ul className="list-disc pl-5 mt-2 text-xs">
            {error.inEligibleResponse.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        )}
        {isRetryable && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
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
      <Card>
        <CardContent className="pt-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your application (ID:{" "}
            <span className="font-medium">{submittedData?.id || "N/A"}</span>)
            has been received.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription className="font-bold mb-3 text-center">
            our team will get in touch with you soon
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
          <Button
            onClick={() => {
              const storedUser = localStorage.getItem("user");
              let role: string | null = null;

              if (storedUser) {
                try {
                  const parsedUser = JSON.parse(storedUser);
                  role = parsedUser.role || null;
                } catch (err) {
                  console.error("Error parsing user from localStorage:", err);
                }
              }

              if (role && role !== "USER") {
                window.location.href =
                  "https://homobie-partner-portal.vercel.app/builder";
              } else {
                window.location.href =
                  "https://homobie-partner-portal.vercel.app";
              }
            }}
          >
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const getQuestions = (loanType: string) => {
  const baseQuestions = [
    {
      id: "loanType",
      title: "What type of loan are you looking for?",
      type: "choice",
      options: [
        { value: "HOME_LOAN", label: "Home Loan", icon: Home },
        { value: "LAP", label: "Loan Against Property", icon: Building },
        {
          value: "BT_TOPUP",
          label: "Balance Transfer Top-Up",
          icon: ArrowRightLeft,
        },
      ],
    },
    {
      id: "amount",
      title: "How much loan amount do you need?",
      type: "input",
      inputType: "number",
      placeholder: "Enter loan amount (₹)",
      description: "Minimum: ₹1,00,000 | Maximum: ₹1,00,00,000",
    },
    {
      id: "tenure",
      title: "What loan tenure are you comfortable with?",
      type: "input",
      inputType: "number",
      placeholder: "Enter tenure in years",
      description: "Duration in years (1-30 years)",
    },
    {
      id: "interestRate",
      title: "What interest rate are you expecting?",
      type: "input",
      inputType: "number",
      placeholder: "Enter interest rate (%)",
      description: "Rate per annum (5-20%)",
    },
    {
      id: "purpose",
      title: "What is the purpose of this loan?",
      type: "textarea",
      placeholder: "Please provide a detailed description...",
      description: "Be specific about how you plan to use the loan amount",
    },
  ];

  if (loanType === "HOME_LOAN" || loanType === "LAP") {
    baseQuestions.push(
      {
        id: "propertyValue",
        title: "What is the estimated property value?",
        type: "input",
        inputType: "number",
        placeholder: "Enter property value (₹)",
        description: "Estimated market value of the property",
      },
      {
        id: "propertyAddressLine1",
        title: "What is the property address?",
        type: "input",
        inputType: "text",
        placeholder: "House/Flat number, Street name, Area",
        description: "Property location details",
      },
      {
        id: "propertyCountry",
        title: "Select property country",
        type: "dropdown",
        placeholder: "Select Country",
        description: "Country where property is located",
      },
      {
        id: "propertyState",
        title: "Select property state",
        type: "dropdown",
        placeholder: "Select State",
        description: "State where property is located",
      },
      {
        id: "propertyCity",
        title: "Select property city",
        type: "dropdown",
        placeholder: "Select City",
        description: "City where property is located",
      },
      {
        id: "propertyPincode",
        title: "What is the property pincode?",
        type: "input",
        inputType: "text",
        placeholder: "Enter 6-digit pincode",
        description: "Postal code of the property",
      }
    );
  }

  if (loanType === "BT_TOPUP") {
    baseQuestions.push(
      {
        id: "existingLoanDetails.currentLender",
        title: "Who is your current lender?",
        type: "input",
        inputType: "text",
        placeholder: "Enter bank/lender name",
        description: "Name of your current loan provider",
      },
      {
        id: "existingLoanDetails.accountNumber",
        title: "What is your loan account number?",
        type: "input",
        inputType: "text",
        placeholder: "Enter account number",
        description: "Your existing loan account number",
      },
      {
        id: "existingLoanDetails.outstandingAmount",
        title: "What is the outstanding loan amount?",
        type: "input",
        inputType: "number",
        placeholder: "Enter outstanding amount (₹)",
        description: "Current outstanding balance",
      },
      {
        id: "existingLoanDetails.currentInterestRate",
        title: "What is your current interest rate?",
        type: "input",
        inputType: "number",
        placeholder: "Enter interest rate (%)",
        description: "Current interest rate on existing loan",
      },
      {
        id: "existingLoanDetails.remainingTenure",
        title: "What is the remaining loan tenure?",
        type: "input",
        inputType: "number",
        placeholder: "Enter remaining tenure (months)",
        description: "Remaining months to complete the loan",
      },
      {
        id: "existingLoanDetails.emiAmount",
        title: "What is your current EMI amount?",
        type: "input",
        inputType: "number",
        placeholder: "Enter EMI amount (₹)",
        description: "Your monthly EMI payment",
      }
    );
  }

  baseQuestions.push(
    {
      id: "employmentType",
      title: "What is your employment type?",
      type: "choice",
      options: [
        { value: "salaried", label: "Salaried Employee" },
        { value: "self-employed", label: "Self-Employed" },
      ],
    },
    {
      id: "monthlyIncome",
      title: "What is your monthly income?",
      type: "input",
      inputType: "number",
      placeholder: "Enter monthly income (₹)",
      description: "Your average monthly income",
    },
    {
      id: "cibilScore",
      title: "What is your CIBIL score?",
      type: "input",
      inputType: "number",
      placeholder: "Enter CIBIL score (300-900)",
      description: "Your credit score",
    },
    {
      id: "age",
      title: "What is your age?",
      type: "input",
      inputType: "number",
      placeholder: "Enter your age",
      description: "Age must be between 21 and 65 years",
    }
  );

  return baseQuestions;
};

interface MultiStepFormProps {
  form: UseFormReturn<LoanFormValues>;
  onSubmit: (data: LoanFormValues) => void;
  isSubmitting: boolean;
}

const MultiStepLoanForm = ({
  form,
  onSubmit,
  isSubmitting,
}: MultiStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPropertyCountry, setSelectedPropertyCountry] = useState("");
  const [selectedPropertyState, setSelectedPropertyState] = useState("");

  const watchedLoanType = form.watch("loanType");
  const questions = getQuestions(watchedLoanType);
  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = async () => {
    const fieldPath = currentQuestion.id.split(".");
    const isValid = await form.trigger(fieldPath as any);

    if (isValid) {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onSubmit(form.getValues());
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderQuestion = () => {
    if (currentQuestion.type === "choice") {
      return (
        <FormField
          key={`${currentQuestion.id}-${currentStep}`}
          control={form.control}
          name={currentQuestion.id as any}
          render={({ field }) => (
            <FormItem className="space-y-6">
              <div className="space-y-4">
                {currentQuestion.options?.map((option) => {
                  const Icon = option.icon;
                  const isSelected = field.value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        field.onChange(option.value);
                        setTimeout(handleNext, 300);
                      }}
                      className={`w-full p-6 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 text-left ${
                        isSelected
                          ? "border-white bg-gray-500/10"
                          : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                      }`}
                    >
                      {Icon && <Icon className="h-6 w-6 text-white" />}
                      <span className="text-lg font-medium text-white">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
      );
    }

    if (currentQuestion.type === "dropdown") {
      if (currentQuestion.id === "propertyCountry") {
        return (
          <FormField
            key={`${currentQuestion.id}-${currentStep}`}
            control={form.control}
            name="propertyCountry"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedPropertyCountry(value);
                    setSelectedPropertyState("");
                    form.setValue("propertyState", "");
                    form.setValue("propertyCity", "");
                  }}
                  value={field.value as string}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-14 text-lg">
                      <SelectValue placeholder={currentQuestion.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white max-h-60">
                    {Country.getAllCountries().map((c) => (
                      <SelectItem
                        key={c.isoCode}
                        value={c.isoCode}
                        className="hover:bg-gray-700"
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentQuestion.description && (
                  <FormDescription className="text-gray-400">
                    {currentQuestion.description}
                  </FormDescription>
                )}
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        );
      }

      if (currentQuestion.id === "propertyState") {
        return (
          <FormField
            key={`${currentQuestion.id}-${currentStep}`}
            control={form.control}
            name="propertyState"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedPropertyState(value);
                    form.setValue("propertyCity", "");
                  }}
                  value={field.value as string}
                  disabled={!selectedPropertyCountry}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-14 text-lg">
                      <SelectValue placeholder={currentQuestion.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white max-h-60">
                    {selectedPropertyCountry &&
                      State.getStatesOfCountry(selectedPropertyCountry).map(
                        (s) => (
                          <SelectItem
                            key={s.isoCode}
                            value={s.isoCode}
                            className="hover:bg-gray-700"
                          >
                            {s.name}
                          </SelectItem>
                        )
                      )}
                  </SelectContent>
                </Select>
                {currentQuestion.description && (
                  <FormDescription className="text-gray-400">
                    {currentQuestion.description}
                  </FormDescription>
                )}
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        );
      }

      if (currentQuestion.id === "propertyCity") {
        return (
          <FormField
            key={`${currentQuestion.id}-${currentStep}`}
            control={form.control}
            name="propertyCity"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  value={field.value as string}
                  disabled={!selectedPropertyState}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-14 text-lg">
                      <SelectValue placeholder={currentQuestion.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white max-h-60">
                    {selectedPropertyCountry &&
                      selectedPropertyState &&
                      City.getCitiesOfState(
                        selectedPropertyCountry,
                        selectedPropertyState
                      ).map((city) => (
                        <SelectItem
                          key={city.name}
                          value={city.name}
                          className="hover:bg-gray-700"
                        >
                          {city.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {currentQuestion.description && (
                  <FormDescription className="text-gray-400">
                    {currentQuestion.description}
                  </FormDescription>
                )}
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        );
      }
    }

    if (currentQuestion.type === "textarea") {
      return (
        <FormField
          key={`${currentQuestion.id}-${currentStep}`}
          control={form.control}
          name={currentQuestion.id as any}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="bg-gray-800 border-gray-700 text-white min-h-[120px] text-lg placeholder:text-gray-500"
                  placeholder={currentQuestion.placeholder}
                  {...field}
                />
              </FormControl>
              {currentQuestion.description && (
                <FormDescription className="text-gray-400">
                  {currentQuestion.description}
                </FormDescription>
              )}
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        key={`${currentQuestion.id}-${currentStep}`}
        control={form.control}
        name={currentQuestion.id as any}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                className="bg-gray-800 border-gray-700 text-white h-14 text-lg placeholder:text-gray-500"
                type={currentQuestion.inputType}
                placeholder={currentQuestion.placeholder}
                {...field}
              />
            </FormControl>
            {currentQuestion.description && (
              <FormDescription className="text-gray-400">
                {currentQuestion.description}
              </FormDescription>
            )}
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold text-sm">
              Question {currentStep + 1} of {questions.length}
            </span>
            <span className="text-white font-bold text-lg">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gray-500 to-blue-900 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur">
          <CardContent className="pt-12 pb-8 px-8">
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {currentStep + 1}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {currentQuestion.title}
                </h2>
              </div>
            </div>

            <Form {...form}>
              <div className="space-y-6">
                {renderQuestion()}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 h-12 bg-gray-900 border-gray-700 text-white hover:text-white hover:bg-gray-700"
                    >
                      <ChevronLeft className="mr-2 h-5 w-5" />
                      Back
                    </Button>
                  )}

                  {currentQuestion.type !== "choice" && (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="flex-1 h-12 hover:bg-gray-900 bg-gray-700 text-white font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : currentStep === questions.length - 1 ? (
                        <>
                          Submit Application
                          <Check className="ml-2 h-5 w-5" />
                        </>
                      ) : (
                        <>
                          Continue
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="mt-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl w-full">
          <CardContent className="p-6 text-white">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1 drop-shadow-lg">
                  Get the best offer
                </h3>
                <p className="text-gray-400 text-sm">
                  Find the best offer for you by comparing offers from over 50+
                  banks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
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
      loanType:
        loanTypeParam === "lap"
          ? "LAP"
          : loanTypeParam === "bt-topup"
          ? "BT_TOPUP"
          : "HOME_LOAN",
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
        throw new ApiError(
          "Authentication required. Please log in to continue.",
          401,
          undefined,
          "AUTH_REQUIRED"
        );
      }

      const payload = {
        userId,
        loanType: data.loanType,
        amount: Number(data.amount),
        tenure: Number(data.tenure) * 12,
        interestRate: Number(data.interestRate),
        purpose: data.purpose.trim(),
        collateral:
          data.loanType === "HOME_LOAN" || data.loanType === "LAP"
            ? {
                propertyValue: Number(data.propertyValue),
                propertyAddress: {
                  addressLine1: data.propertyAddressLine1?.trim() || "",
                  addressLine2: data.propertyAddressLine2?.trim() || "",
                  landmark: data.propertyLandmark?.trim() || "",
                  city: data.propertyCity?.trim() || "",
                  state: data.propertyState?.trim() || "",
                  pincode: data.propertyPincode?.trim() || "",
                  country: data.propertyCountry?.trim() || "India",
                },
              }
            : undefined,
        applicantProfile: {
          monthlyIncome: Number(data.monthlyIncome),
          cibilScore: Number(data.cibilScore),
          age: Number(data.age),
          employmentType: data.employmentType.toUpperCase(),
          existingLoanDetails:
            data.loanType === "BT_TOPUP" && data.existingLoanDetails
              ? {
                  ...data.existingLoanDetails,
                  outstandingAmount: Number(
                    data.existingLoanDetails.outstandingAmount
                  ),
                  currentInterestRate: Number(
                    data.existingLoanDetails.currentInterestRate
                  ),
                  remainingTenure: Number(
                    data.existingLoanDetails.remainingTenure
                  ),
                  emiAmount: Number(data.existingLoanDetails.emiAmount),
                }
              : "None",
        },
      };

      return apiClient<any>("/loan/add", "POST", payload);
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      setSubmittedData(data);
      setError(null);
      toast({
        title: "Success!",
        description:
          data.message ||
          "Your loan application has been submitted successfully.",
      });
    },
    onError: (err: unknown) => {
      const apiError = err as ApiError;
      form.clearErrors();

      if (
        (apiError.status === 400 || apiError.status === 422) &&
        Array.isArray(apiError.details)
      ) {
        apiError.details.forEach((fieldError: any) => {
          const fieldName = (fieldError.path?.[0] ||
            fieldError.field) as keyof LoanFormValues;
          if (fieldName && typeof fieldName === "string") {
            form.setError(fieldName, {
              type: "server",
              message: fieldError.message,
            });
          }
        });
        toast({
          title: "Validation Error",
          description:
            "Please check the errors highlighted in the form and try again.",
          variant: "destructive",
        });
        setError(null);
      } else {
        setError(apiError);
        toast({
          title:
            apiError.eligibility === "ineligible"
              ? "Application Not Eligible"
              : "Submission Failed",
          description: apiError.message,
          variant: "destructive",
          duration: 8000,
        });
      }

      if (apiError.status === 401) {
        setTimeout(() => navigate("/auth"), 2000);
      }
    },
  });

  const onSubmit = (data: LoanFormValues) => {
    setError(null);
    loanApplicationMutation.mutate(data);
  };

  return (
    <div className="bg-black">
      <main className="py-12 pt-20 ">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {isSuccess ? (
              <SubmissionSuccess submittedData={submittedData} />
            ) : (
              <div className="space-y-8">
                <FormError
                  error={error}
                  onRetry={() => onSubmit(form.getValues())}
                  isRetrying={loanApplicationMutation.isPending}
                />

                <MultiStepLoanForm
                  form={form}
                  onSubmit={onSubmit}
                  isSubmitting={loanApplicationMutation.isPending}
                />

                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Not sure about your loan amount?</CardTitle>
                    <CardDescription>
                      Use our calculator to find the perfect loan for your needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LoanCalculator
                      onApply={(loanDetails) => {
                        form.setValue(
                          "loanType",
                          getLoanTypeFromParam(loanDetails.loanType)
                        );
                        form.setValue("amount", loanDetails.amount);
                        form.setValue("interestRate", loanDetails.interestRate);
                        form.setValue("tenure", loanDetails.tenure * 12);
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <ChatbotButton />
    </div>
  );
}
