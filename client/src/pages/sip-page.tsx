import React, { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PaymentGateway } from "@/components/ui/payment-gateway";

import { ChatbotButton } from "@/components/layout/chatbot-button";
import { SipCalculator } from "@/components/ui/sip-calculator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Check,
  ChartLine,
  Calendar,
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  BarChart3,
  Target,
  Landmark,
} from "lucide-react";
import {
  formatCurrency,
  getQueryParam,
  calculateSIPReturns,
} from "@/lib/utils";

// SIP Plans
const SIP_PLANS = [
  {
    id: "equity-growth",
    name: "Equity Growth Plan",
    description:
      "High growth potential with higher risk. Suitable for long-term investors.",
    minAmount: 1000,
    expectedReturns: 12,
    riskLevel: "High",
    recommendedDuration: 60, // months
    assetAllocation: { equity: 80, debt: 15, others: 5 },
  },
  {
    id: "balanced-hybrid",
    name: "Balanced Hybrid Plan",
    description:
      "Moderate growth with balanced risk. Good for medium-term goals.",
    minAmount: 500,
    expectedReturns: 10,
    riskLevel: "Medium",
    recommendedDuration: 36, // months
    assetAllocation: { equity: 50, debt: 45, others: 5 },
  },
  {
    id: "debt-stability",
    name: "Debt Stability Plan",
    description:
      "Stable returns with lower risk. Ideal for conservative investors.",
    minAmount: 1000,
    expectedReturns: 8,
    riskLevel: "Low",
    recommendedDuration: 24, // months
    assetAllocation: { equity: 20, debt: 75, others: 5 },
  },
  {
    id: "tax-saver",
    name: "Tax-Saver ELSS Plan",
    description:
      "Tax benefits under Section 80C with equity exposure for growth.",
    minAmount: 500,
    expectedReturns: 11,
    riskLevel: "Medium-High",
    recommendedDuration: 36, // months
    assetAllocation: { equity: 75, debt: 20, others: 5 },
  },
];

// Extend the SIP schema for client-side validation
const sipFormSchema = z.object({
  planName: z.string({
    required_error: "Please select a SIP plan",
  }),
  monthlyAmount: z.coerce
    .number()
    .min(500, {
      message: "Monthly amount must be at least ₹500",
    })
    .max(100000, {
      message: "Monthly amount cannot exceed ₹1,00,000",
    }),
  startDate: z.union([
    z.date({
      required_error: "Please select a start date",
    }),
    z.string().transform((date) => new Date(date)),
  ]),
  durationMonths: z.coerce
    .number()
    .min(12, {
      message: "Duration must be at least 12 months",
    })
    .max(360, {
      message: "Duration cannot exceed 360 months",
    }),
  expectedReturns: z.coerce
    .number()
    .min(6, {
      message: "Expected returns must be at least 6%",
    })
    .max(18, {
      message: "Expected returns cannot exceed 18%",
    }),
  autoDebit: z.boolean().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
});

type SipFormValues = z.infer<typeof sipFormSchema>;

export default function SipPage() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string>("equity-growth");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get query parameters if any
  const amountParam = getQueryParam("amount");
  const periodParam = getQueryParam("period");
  const rateParam = getQueryParam("rate");

  // Find selected plan details
  const selectedPlanDetails =
    SIP_PLANS.find((plan) => plan.id === selectedPlan) || SIP_PLANS[0];

  // Initialize form with default values or from query parameters
  const form = useForm<SipFormValues>({
    resolver: zodResolver(sipFormSchema),
    defaultValues: {
      planName: selectedPlanDetails.name,
      monthlyAmount: amountParam
        ? Number(amountParam)
        : selectedPlanDetails.minAmount,
      startDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default to next week
      durationMonths: periodParam
        ? Number(periodParam) * 12
        : selectedPlanDetails.recommendedDuration, // Convert years to months if from query
      expectedReturns: rateParam
        ? Number(rateParam)
        : selectedPlanDetails.expectedReturns,
      autoDebit: true,
    },
  });

  // Update form when plan changes
  useEffect(() => {
    if (selectedPlanDetails) {
      form.setValue("planName", selectedPlanDetails.name);
      form.setValue("expectedReturns", selectedPlanDetails.expectedReturns);

      // Only set minimum amount and duration if not already set from query params
      if (!amountParam) {
        form.setValue("monthlyAmount", selectedPlanDetails.minAmount);
      }

      if (!periodParam) {
        form.setValue(
          "durationMonths",
          selectedPlanDetails.recommendedDuration
        );
      }
    }
  }, [selectedPlan, selectedPlanDetails, form, amountParam, periodParam]);

  // Initialize toast
  const { toast } = useToast();

  // Track submitted data for payment
  const [submittedData, setSubmittedData] = useState<any>(null);

  // Create SIP investment mutation
  const createSipMutation = useMutation({
    mutationFn: async (data: SipFormValues) => {
      const res = await apiRequest("POST", "/api/sip-investments", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sip-investments"] });
      setSubmittedData(data);
      setIsSuccess(true);
      setIsSubmitting(false);
      // Remove automatic navigation to allow payment process
    },
    onError: (error) => {
      console.error("Error creating SIP investment:", error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to create SIP investment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: SipFormValues) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    createSipMutation.mutate(data);
  };

  // Get values for calculations
  const monthlyAmount = form.watch("monthlyAmount") || 0;
  const durationMonths = form.watch("durationMonths") || 0;
  const expectedReturns = form.watch("expectedReturns") || 0;

  // Calculate SIP returns
  const sipReturns = calculateSIPReturns(
    monthlyAmount,
    expectedReturns,
    durationMonths / 12
  );

  return (
    <div>
      <main className="py-12 pt-24">
        <div className="container mx-auto px-4">
          {isSuccess ? (
            <div className="max-w-3xl mx-auto space-y-8">
              <Card className="mb-8">
                <CardContent className="pt-6 pb-8 text-center">
                  <div className="w-16 h-16 bg-transparent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    SIP Plan Created Successfully!
                  </h2>
                  <p className="text-white mb-2">
                    Your SIP investment plan has been set up. Plan ID:{" "}
                    <span className="font-medium">{submittedData?.id}</span>
                  </p>
                  <p className="text-white mb-6">
                    To activate your SIP, please complete your first
                    contribution payment below.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>First SIP Contribution</CardTitle>
                  <CardDescription>
                    Make your first contribution to activate your SIP plan.
                    Subsequent payments will be automatically processed on the
                    same date each month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <PaymentGateway
                      paymentType="sip-investment"
                      itemId={submittedData?.id}
                      buttonText="Make First Contribution"
                      description="Pay your first monthly contribution to activate your SIP"
                      onSuccess={(data) => {
                        toast({
                          title: "Payment Successful",
                          description:
                            "Your SIP has been activated successfully. Next payment will be on the scheduled date.",
                        });
                      }}
                      onFailure={(error) => {
                        toast({
                          title: "Payment Failed",
                          description:
                            error?.message ||
                            "There was an error processing your payment.",
                          variant: "destructive",
                        });
                      }}
                    />
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <p className="text-yellow-700 mb-2">
                        Please login to make a payment
                      </p>
                      <Button asChild>
                        <Link href="/auth">Login or Register</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Back to Home
                  </Button>
                  <Button onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <>
              <div className="max-w-4xl mx-auto mb-12 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">
                  Start Your Wealth Creation Journey with SIP
                </h1>
                <p className="text-white mb-8 max-w-3xl mx-auto">
                  Systematic Investment Plans (SIPs) allow you to invest small
                  amounts regularly in mutual funds, helping you build wealth
                  over time through the power of compounding.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1 mr-4">
                      <ChartLine className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-white">
                        Power of Compounding
                      </h3>
                      <p className="text-white">
                        Start early and let your investments grow exponentially
                        over time.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1 mr-4">
                      <Calendar className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-white">
                        Disciplined Investing
                      </h3>
                      <p className="text-white">
                        Regular investments help you develop a saving habit and
                        financial discipline.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1 mr-4">
                      <DollarSign className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-white">
                        Start with Just ₹500
                      </h3>
                      <p className="text-white">
                        Begin your investment journey with as little as ₹500 per
                        month.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-w-6xl mx-auto">
                <Tabs defaultValue="plans" className="space-y-8">
                  <TabsList className="w-full max-w-md mx-auto">
                    <TabsTrigger value="plans" className="flex-1">
                      SIP Plans
                    </TabsTrigger>
                    <TabsTrigger value="calculator" className="flex-1">
                      SIP Calculator
                    </TabsTrigger>
                    <TabsTrigger value="invest" className="flex-1">
                      Start SIP
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="plans">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {SIP_PLANS.map((plan) => (
                        <Card
                          key={plan.id}
                          className={`cursor-pointer transition-all hover:shadow-md overflow-hidden ${
                            selectedPlan === plan.id
                              ? "border-primary ring-2 ring-primary/20"
                              : ""
                          }`}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          <div
                            className={`h-2 ${
                              plan.riskLevel === "High"
                                ? "bg-red-500"
                                : plan.riskLevel === "Medium-High"
                                ? "bg-orange-500"
                                : plan.riskLevel === "Medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{plan.name}</CardTitle>
                                <CardDescription>
                                  {plan.description}
                                </CardDescription>
                              </div>
                              {selectedPlan === plan.id && (
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-white mb-1">
                                  Expected Returns
                                </p>
                                <p className="text-lg font-semibold text-white flex items-center">
                                  {plan.expectedReturns}%{" "}
                                  <ArrowUpRight className="h-4 w-4 ml-1" />
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-white mb-1">
                                  Risk Level
                                </p>
                                <p
                                  className={`text-sm font-medium px-2 py-1 rounded-full inline-flex items-center ${
                                    plan.riskLevel === "High"
                                      ? "bg-red-100 text-red-800"
                                      : plan.riskLevel === "Medium-High"
                                      ? "bg-orange-100 text-orange-800"
                                      : plan.riskLevel === "Medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {plan.riskLevel}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-white mb-1">
                                  Minimum Investment
                                </p>
                                <p className="font-medium">
                                  ₹{plan.minAmount}/month
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-white mb-1">
                                  Recommended Duration
                                </p>
                                <p className="font-medium">
                                  {plan.recommendedDuration / 12} years
                                </p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <p className="text-sm font-medium mb-2">
                                Asset Allocation
                              </p>
                              <div className="space-y-2">
                                <div>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Equity</span>
                                    <span>{plan.assetAllocation.equity}%</span>
                                  </div>
                                  <Progress
                                    value={plan.assetAllocation.equity}
                                  />
                                </div>
                                <div>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Debt</span>
                                    <span>{plan.assetAllocation.debt}%</span>
                                  </div>
                                  <Progress value={plan.assetAllocation.debt} />
                                </div>
                                <div>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Others</span>
                                    <span>{plan.assetAllocation.others}%</span>
                                  </div>
                                  <Progress
                                    value={plan.assetAllocation.others}
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button
                              variant="outline"
                              className="w-full border-primary bg-transparent text-white hover:bg-primary hover:text-white"
                              onClick={() => {
                                setSelectedPlan(plan.id);
                                const element = document.querySelector(
                                  '[data-value="invest"]'
                                ) as HTMLElement;
                                if (element) element.click();
                              }}
                            >
                              Start With This Plan
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>

                    <div className="max-w-3xl mx-auto mt-12">
                      <Card>
                        <CardHeader>
                          <CardTitle>Frequently Asked Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            <AccordionItem value="item-1">
                              <AccordionTrigger>
                                What is a Systematic Investment Plan (SIP)?
                              </AccordionTrigger>
                              <AccordionContent>
                                A Systematic Investment Plan (SIP) is an
                                investment method offered by mutual funds where
                                you can invest a fixed amount at regular
                                intervals (weekly, monthly, quarterly) instead
                                of making a lump-sum investment. This helps in
                                rupee-cost averaging and disciplined investing.
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2">
                              <AccordionTrigger>
                                How do SIPs work?
                              </AccordionTrigger>
                              <AccordionContent>
                                SIPs work by investing a fixed amount at regular
                                intervals, regardless of market conditions. When
                                markets are high, your money buys fewer units,
                                and when markets are low, your money buys more
                                units. This results in a lower average cost per
                                unit over time, known as rupee-cost averaging.
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                              <AccordionTrigger>
                                What is the minimum amount to start a SIP?
                              </AccordionTrigger>
                              <AccordionContent>
                                You can start a SIP with as little as ₹500 per
                                month. Some plans may have a higher minimum
                                amount based on the fund's policy.
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4">
                              <AccordionTrigger>
                                Can I change or stop my SIP?
                              </AccordionTrigger>
                              <AccordionContent>
                                Yes, you have the flexibility to increase,
                                decrease, pause, or stop your SIP at any time.
                                However, it's advisable to continue your SIP for
                                the long term to benefit from compounding and
                                rupee-cost averaging.
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-5">
                              <AccordionTrigger>
                                Is SIP suitable for long-term or short-term
                                goals?
                              </AccordionTrigger>
                              <AccordionContent>
                                SIPs are ideal for long-term goals (5+ years) as
                                they help in wealth creation through the power
                                of compounding. However, different SIP plans can
                                be chosen based on your time horizon -
                                equity-based for long-term, debt-based for short
                                to medium-term goals.
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="calculator">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <Card>
                          <CardHeader>
                            <CardTitle>SIP Calculator</CardTitle>
                            <CardDescription className="text-white">
                              Estimate your potential returns with regular SIP
                              investments
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <SipCalculator
                              onStart={(sipDetails) => {
                                form.setValue(
                                  "monthlyAmount",
                                  sipDetails.monthlyAmount
                                );
                                form.setValue(
                                  "durationMonths",
                                  sipDetails.investmentPeriod * 12
                                ); // Convert years to months
                                form.setValue(
                                  "expectedReturns",
                                  sipDetails.expectedReturnRate
                                );
                                const element = document.querySelector(
                                  '[data-value="invest"]'
                                ) as HTMLElement;
                                if (element) element.click();
                              }}
                            />
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-6">
                        <Card className="bg-primary text-white">
                          <CardHeader className="pb-2">
                            <CardTitle>The Magic of Compounding</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4">
                              Witness how your small monthly investments grow
                              over time through the power of compounding.
                            </p>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <TrendingUp className="h-6 w-6" />
                                </div>
                                <p className="text-xs text-white/80">
                                  Start Early
                                </p>
                              </div>
                              <div className="text-center">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <Clock className="h-6 w-6" />
                                </div>
                                <p className="text-xs text-white/80">
                                  Stay Invested
                                </p>
                              </div>
                              <div className="text-center">
                                <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center mx-auto mb-2">
                                  <BarChart className="h-6 w-6" />
                                </div>
                                <p className="text-xs text-white/80">
                                  Grow Wealth
                                </p>
                              </div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4">
                              <p className="text-sm mb-3">
                                Example: Monthly investment of ₹5,000
                              </p>
                              <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-white/5 p-2 rounded">
                                  <p className="text-xs text-white/70">
                                    5 Years
                                  </p>
                                  <p className="font-semibold">₹3.8L</p>
                                </div>
                                <div className="bg-white/5 p-2 rounded">
                                  <p className="text-xs text-white/70">
                                    10 Years
                                  </p>
                                  <p className="font-semibold">₹9.5L</p>
                                </div>
                                <div className="bg-white/5 p-2 rounded">
                                  <p className="text-xs text-white/70">
                                    20 Years
                                  </p>
                                  <p className="font-semibold">₹29.6L</p>
                                </div>
                              </div>
                              <p className="text-xs mt-3 text-white/70">
                                *Assuming 12% annual returns
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle>Benefits of SIP Investment</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-start">
                              <div className="mr-3 bg-primary/10 p-2 rounded-full">
                                <BarChart3 className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium">
                                  Rupee Cost Averaging
                                </h3>
                                <p className="text-sm text-white">
                                  Buy more units when prices are low and fewer
                                  when prices are high, reducing overall cost.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="mr-3 bg-primary/10 p-2 rounded-full">
                                <Target className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium">
                                  Goal-Based Investing
                                </h3>
                                <p className="text-sm text-white">
                                  Align your investments with specific financial
                                  goals like education, retirement, etc.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="mr-3 bg-primary/10 p-2 rounded-full">
                                <ShieldCheck className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium">Risk Mitigation</h3>
                                <p className="text-sm text-white">
                                  Reduce impact of market volatility through
                                  systematic investing.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="invest">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-2">
                        <Card>
                          <CardHeader>
                            <CardTitle>Start Your SIP Journey</CardTitle>
                            <CardDescription className="text-white">
                              Set up your Systematic Investment Plan
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Form {...form}>
                              <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6 bg-transparent text-white border border-white p-6 rounded-md"
                              >
                                {/* SIP Plan */}
                                <FormField
                                  control={form.control}
                                  name="planName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-white">
                                        SIP Plan
                                      </FormLabel>
                                      <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="bg-transparent text-white border border-white">
                                            <SelectValue placeholder="Select a SIP plan" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-transparent text-white border border-white">
                                          {SIP_PLANS.map((plan) => (
                                            <SelectItem
                                              key={plan.id}
                                              value={plan.name}
                                              className="hover:bg-gray-800"
                                            >
                                              {plan.name} - {plan.riskLevel}{" "}
                                              Risk
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage className="text-red-400" />
                                    </FormItem>
                                  )}
                                />

                                {/* Monthly Amount + Duration */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <FormField
                                    control={form.control}
                                    name="monthlyAmount"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white">
                                          Monthly Investment Amount (₹)
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            placeholder="Enter monthly amount"
                                            className="bg-transparent text-white border border-white placeholder-gray-400"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormDescription className="text-gray-300">
                                          Minimum ₹
                                          {selectedPlanDetails.minAmount} per
                                          month
                                        </FormDescription>
                                        <FormMessage className="text-red-400" />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="durationMonths"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white">
                                          Investment Duration (Months)
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            placeholder="Enter duration in months"
                                            className="bg-transparent text-white border border-white placeholder-gray-400"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormDescription className="text-gray-300">
                                          Recommended minimum{" "}
                                          {
                                            selectedPlanDetails.recommendedDuration
                                          }{" "}
                                          months
                                        </FormDescription>
                                        <FormMessage className="text-red-400" />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                {/* Start Date + Expected Returns */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white">
                                          Start Date
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            type="date"
                                            min={
                                              new Date()
                                                .toISOString()
                                                .split("T")[0]
                                            }
                                            className="bg-transparent text-white border border-white placeholder-gray-400"
                                            {...field}
                                            value={
                                              field.value instanceof Date
                                                ? field.value
                                                    .toISOString()
                                                    .split("T")[0]
                                                : field.value
                                            }
                                          />
                                        </FormControl>
                                        <FormDescription className="text-gray-300">
                                          First installment will be debited on
                                          this date
                                        </FormDescription>
                                        <FormMessage className="text-red-400" />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="expectedReturns"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white">
                                          Expected Returns (%)
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            step="0.1"
                                            placeholder="Enter expected annual returns"
                                            className="bg-transparent text-white border border-white placeholder-gray-400"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormDescription className="text-gray-300">
                                          Based on historical performance of
                                          selected plan
                                        </FormDescription>
                                        <FormMessage className="text-red-400" />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <Separator className="border-white/40" />

                                {/* Payment Details */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-medium text-white">
                                    Payment Details
                                  </h3>

                                  <FormField
                                    control={form.control}
                                    name="autoDebit"
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white p-4 bg-transparent">
                                        <div className="space-y-0.5">
                                          <FormLabel className="text-base text-white">
                                            Auto Debit Authorization
                                          </FormLabel>
                                          <FormDescription className="text-gray-300">
                                            Allow automatic debit from your bank
                                            account for SIP installments
                                          </FormDescription>
                                        </div>
                                        <FormControl>
                                          <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="w-5 h-5 accent-white bg-transparent border border-white"
                                            aria-label="Auto Debit Authorization"
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />

                                  {form.watch("autoDebit") && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <FormField
                                        control={form.control}
                                        name="bankName"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-white">
                                              Bank Name
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                placeholder="Enter your bank name"
                                                className="bg-transparent text-white border border-white placeholder-gray-400"
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={form.control}
                                        name="bankAccountNumber"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-white">
                                              Account Number
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                placeholder="Enter your account number"
                                                className="bg-transparent text-white border border-white placeholder-gray-400"
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  )}
                                </div>
                                <Button
                                  type="submit"
                                  className="w-full"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting
                                    ? "Processing..."
                                    : "Start SIP Investment"}
                                </Button>
                              </form>
                            </Form>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-6">
                        <Card className="bg-transparent border-primary/20">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              Your SIP Summary
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-white">
                                  SIP Plan
                                </span>
                                <span className="font-medium">
                                  {form.watch("planName")}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-white">
                                  Monthly Investment
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(monthlyAmount)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-white">
                                  Investment Period
                                </span>
                                <span className="font-medium">
                                  {Math.round(durationMonths / 12)} years (
                                  {durationMonths} months)
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-white">
                                  Expected Returns
                                </span>
                                <span className="font-medium">
                                  {expectedReturns}% p.a.
                                </span>
                              </div>
                              <Separator />
                              <div className="flex justify-between">
                                <span className="text-sm text-white">
                                  Total Investment
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(sipReturns.totalInvestment)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-white">
                                  Estimated Returns
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(sipReturns.estimatedReturns)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-white">
                                  Total Value
                                </span>
                                <span className="font-semibold text-white">
                                  {formatCurrency(sipReturns.totalValue)}
                                </span>
                              </div>
                            </div>

                            <div className="mt-6 pb-2">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">
                                  Investment vs. Returns
                                </span>
                              </div>
                              <div className="w-full h-4 rounded-full overflow-hidden bg-transparent">
                                <div className="flex h-full">
                                  <div
                                    className="bg-primary h-full"
                                    style={{
                                      width: `${
                                        (sipReturns.totalInvestment /
                                          sipReturns.totalValue) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                  <div
                                    className="bg-[#FFB800] h-full"
                                    style={{
                                      width: `${
                                        (sipReturns.estimatedReturns /
                                          sipReturns.totalValue) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex justify-between mt-2 text-xs">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-primary rounded-full mr-1"></div>
                                  <span>Investment</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-[#FFB800] rounded-full mr-1"></div>
                                  <span>Returns</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              Risk Assessment
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-sm text-white">
                                The selected plan has a{" "}
                                <span
                                  className={`font-medium ${
                                    selectedPlanDetails.riskLevel === "High"
                                      ? "text-red-600"
                                      : selectedPlanDetails.riskLevel ===
                                        "Medium-High"
                                      ? "text-orange-600"
                                      : selectedPlanDetails.riskLevel ===
                                        "Medium"
                                      ? "text-yellow-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {selectedPlanDetails.riskLevel}
                                </span>{" "}
                                risk level.
                              </p>

                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-green-600">
                                  Low Risk
                                </span>
                                <span className="text-xs text-amber-600">
                                  Medium Risk
                                </span>
                                <span className="text-xs text-red-600">
                                  High Risk
                                </span>
                              </div>

                              <div className="h-2 relative bg-gradient-to-r from-green-500 via-amber-500 to-red-500 rounded-full">
                                <div
                                  className="absolute top-0 h-4 w-4 bg-transparent border-2 border-primary rounded-full -mt-1 transform -translate-x-1/2"
                                  style={{
                                    left:
                                      selectedPlanDetails.riskLevel === "High"
                                        ? "90%"
                                        : selectedPlanDetails.riskLevel ===
                                          "Medium-High"
                                        ? "70%"
                                        : selectedPlanDetails.riskLevel ===
                                          "Medium"
                                        ? "50%"
                                        : "20%",
                                  }}
                                ></div>
                              </div>

                              <div className="text-xs text-white mt-4">
                                Investments are subject to market risks. Past
                                performance is not indicative of future returns.
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="flex items-center justify-center p-4 bg-primary/10 rounded-lg">
                          <Landmark className="h-5 w-5 text-white mr-2" />
                          <p className="text-sm text-white">
                            Regulated by SEBI. 100% secure investments.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </main>

      <ChatbotButton />
    </div>
  );
}
