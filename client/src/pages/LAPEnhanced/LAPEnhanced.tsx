import React, { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../hooks/use-toast";
import axios from "axios";
import { ChatbotButton } from "../../components/layout/chatbot-button";
import { LoanCalculator } from "../../components/ui/calculator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Check,
  Loader2,
  XCircle,
  RefreshCw,
  Mail,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getQueryParam } from "../../lib/utils";
import {
  LoanFormValues,
  loanFormSchema,
  ApiError,
  apiClient,
  getUserId,
  getLoanTypeFromParam,
} from "./loan-application-types";
import { MultiStepLoanForm } from "./MultiStepLoanForm";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Email Verification
const EmailVerificationModal = ({
  isOpen,
  onClose,
  onVerificationSuccess,
  formData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: (email: string) => void;
  formData: LoanFormValues;
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleVerifyEmail = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/auth/email-verify`, null, {
  params: { email },
});

      const userType = response.data?.user;

      if (userType === "new_user" || userType === "old_user") {
        toast({
          title: "Email Verified",
          description: `Welcome ${userType === "new_user" ? "new" : "existing"} user!`,
        });

        // Save form temporarily for later submission
        sessionStorage.setItem("pendingLoanApplication", JSON.stringify(formData));
        sessionStorage.setItem("verificationEmail", email);
        sessionStorage.setItem("fromLoanApplication", "true");

        onVerificationSuccess(email);
      } else {
        throw new Error("Unexpected response. Please try again.");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to verify email. Please try again.";
      setError(errorMessage);
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Verify Your Email
          </DialogTitle>
          <DialogDescription>
            Please verify your email before submitting your loan application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-white space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              className="bg-black"
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              onKeyPress={(e) => e.key === "Enter" && handleVerifyEmail()}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button onClick={handleVerifyEmail} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>Verify</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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
  const [location, setLocation] = useLocation();

  return (
    <div className="space-y-8  pt-20">
      <Card>
        <CardContent className="pt-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription className="font-bold mb-3 text-center">
            Our team will get in touch with you soon
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button variant="outline" className='bg-black hover:bg-gray-500 text-white' onClick={() => setLocation("/")}>
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Main Component
export default function LoanApplicationPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<LoanFormValues | null>(
    null
  );

  const loanTypeParam = getQueryParam("type") || "home-loan";

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      finalise: "",
      loanType: "",
      amount: undefined,
      tenure: undefined,
      interestRate: undefined,
      monthlyIncome: undefined,
      cibilScore: undefined,
      age: undefined,
      purpose: "",
      employmentType: undefined,
      propertyValue: undefined,
      propertyAddressLine1: "",
      propertyAddressLine2: "",
      propertyLandmark: "",
      propertyCity: "",
      propertyState: "",
      propertyPincode: "",
      propertyCountry: "",
      existingLoanDetails: undefined,
    },
  });

  const handleEmailVerificationSuccess = (email: string) => {
    setShowEmailModal(false);

    // Redirect to auth
    sessionStorage.setItem("prefilledEmail", email);

    toast({
      title: "Redirecting...",
      description: "Please login or register to submit your application.",
    });

    setTimeout(() => {
      setLocation("/auth");
    }, 1000);
  };

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
        tenure: Number(data.tenure),
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

      sessionStorage.removeItem("pendingLoanApplication");
      sessionStorage.removeItem("verificationEmail");
      sessionStorage.removeItem("fromLoanApplication");

      toast({
        title: "Success!",
        description:
          data.message ||
          "Your loan application has been submitted successfully.We will get in contact with you soon.",
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
        setPendingFormData(form.getValues());
        setShowEmailModal(true);
      }
    },
  });

  const onSubmit = (data: LoanFormValues) => {
    setError(null);

    const userId = getUserId();

    if (!userId) {
      setPendingFormData(data);
      setShowEmailModal(true);
    } else {
      loanApplicationMutation.mutate(data);
    }
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

      <EmailVerificationModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onVerificationSuccess={handleEmailVerificationSuccess}
        formData={pendingFormData!}
      />

      <ChatbotButton />
    </div>
  );
}
