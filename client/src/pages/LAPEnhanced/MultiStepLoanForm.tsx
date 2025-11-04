import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useLocation } from "wouter";
import { Country, State, City } from "country-state-city";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Card,
  CardContent,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Home,
  Building,
  ArrowRightLeft,
  Check,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  X,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { LoanFormValues } from "./loan-application-types";

const getQuestions = (loanType: string) => {
  const baseQuestions = [
    {
      id: "finalise",
      title: "Have you finalized a property?",
      type: "choice",
      options: [
        { value: "YES", label: "Yes, I have", icon: Check },
        { value: "NO", label: "No, I am still looking", icon: X },
      ],
    },
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
      title: "How much loan amount do you desire?",
      type: "input",
      inputType: "number",
      placeholder: "Enter loan amount (₹)",
      description: "Minimum: ₹1,00,000 | Maximum: ₹5,00,000",
    },
    {
      id: "tenure",
      title: "What loan tenure do you desire?",
      type: "input",
      inputType: "number",
      placeholder: "Enter tenure in years",
      description: "Duration in years (1-30 years)",
    },
    {
      id: "interestRate",
      title: "What interest rate do you desire?",
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
        id: "propertyLocation",
        title: "Where is the property located?",
        type: "location",
        description: "Select country, state, city and enter pincode",
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

export const MultiStepLoanForm = ({
  form,
  onSubmit,
  isSubmitting,
}: MultiStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPropertyCountry, setSelectedPropertyCountry] = useState("");
  const [selectedPropertyState, setSelectedPropertyState] = useState("");
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const watchedLoanType = form.watch("loanType");
  const questions = getQuestions(watchedLoanType);
  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = async () => {
    const fieldPath = currentQuestion.id as any;
    const isValid = await form.trigger(fieldPath);

    if (isValid) {
      if (currentQuestion.id === "finalise") {
        const answer = form.getValues("finalise" as any);

        if (answer?.toLowerCase() === "no") {
          toast({
            title: "Redirecting...",
            description: "You'll be taken to the properties page.",
          });
          setTimeout(() => setLocation("/properties"), 1000);
          return;
        }
      }

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

    if (currentQuestion.type === "location") {
      return (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="propertyCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-base">Country</FormLabel>
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
                      <SelectValue placeholder="Select Country" />
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
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyState"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-base">State</FormLabel>
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
                      <SelectValue placeholder="Select State" />
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
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-base">City</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value as string}
                  disabled={!selectedPropertyState}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-14 text-lg">
                      <SelectValue placeholder="Select City" />
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
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyPincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-base">Pincode</FormLabel>
                <FormControl>
                  <Input
                    className="bg-gray-800 border-gray-700 text-white h-14 text-lg placeholder:text-gray-500"
                    placeholder="Enter 6-digit pincode"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {currentQuestion.description && (
            <FormDescription className="text-gray-400">
              {currentQuestion.description}
            </FormDescription>
          )}
        </div>
      );
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
    <div>
      {/* Progress Bar */}
      <div className="w-full mt-2 relative">
        <div className="-ml-[230px] h-4 bg-gray-800 rounded-full overflow-hidden w-[150%] relative">
          <div
            className="h-full bg-gradient-to-r from-gray-500 to-blue-900 transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-sm font-semibold"
              style={{
                transform: "translateY(-50%)",
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-black py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Question Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur">
            <CardContent className="pt-12 pb-8 px-8">
              <div className="mb-2">
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
                    Find the best offer for you by comparing offers from over
                    50+ banks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};