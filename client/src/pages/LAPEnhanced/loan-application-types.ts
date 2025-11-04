import { z } from "zod";

// API Error Class
export class ApiError extends Error {
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

// Schemas
export const existingLoanDetailsSchema = z
  .object({
    currentLender: z.string().min(2, "Current lender name is required"),
    accountNumber: z.string().min(5, "Account number is required"),
    outstandingAmount: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number({
        required_error: "Outstanding amount is required",
        invalid_type_error: "Please enter a valid amount",
      })
        .min(1, "Outstanding amount must be greater than 0")
    ),
    currentInterestRate: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number({
        required_error: "Current interest rate is required",
        invalid_type_error: "Please enter a valid interest rate",
      })
        .min(1, "Current interest rate is required")
    ),
    remainingTenure: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number({
        required_error: "Remaining tenure is required",
        invalid_type_error: "Please enter a valid tenure",
      })
        .min(1, "Remaining tenure is required")
    ),
    emiAmount: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number({
        required_error: "Current EMI amount is required",
        invalid_type_error: "Please enter a valid EMI amount",
      })
        .min(1, "Current EMI amount is required")
    ),
    loanStartDate: z.string().optional(),
  })
  .optional();

export const loanFormSchema = z
  .object({
    finalise: z.string().min(1, "Please select an option"),
    loanType: z.string().min(1, "Please select a loan type"),
    amount: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number({
        required_error: "Loan amount is required",
        invalid_type_error: "Please enter a valid amount",
      })
        .min(100000, "Loan amount must be at least ₹1,00,000")
        .max(500000, "Loan amount cannot exceed ₹5,00,000")
    ),
    tenure: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number({
        required_error: "Tenure is required",
        invalid_type_error: "Please enter a valid tenure",
      })
        .min(1, "Tenure must be at least 1 year")
        .max(30, "Tenure cannot exceed 30 years")
    ),
    interestRate: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number({
        required_error: "Interest rate is required",
        invalid_type_error: "Please enter a valid interest rate",
      })
        .min(5, "Interest rate must be at least 5%")
        .max(20, "Interest rate cannot exceed 20%")
    ),
    monthlyIncome: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number({
        required_error: "Monthly income is required",
        invalid_type_error: "Please enter a valid income",
      })
        .min(20000, "Monthly income must be at least ₹20,000")
    ),
    cibilScore: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number({
        required_error: "CIBIL score is required",
        invalid_type_error: "Please enter a valid CIBIL score",
      })
        .min(300, "CIBIL score must be at least 300")
        .max(900, "CIBIL score cannot exceed 900")
    ),
    age: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number({
        required_error: "Age is required",
        invalid_type_error: "Please enter a valid age",
      })
        .min(21, "Age must be at least 21 years")
        .max(65, "Age cannot exceed 65 years")
    ),
    propertyValue: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number({
        invalid_type_error: "Please enter a valid property value",
      }).optional()
    ),
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

export type LoanFormValues = z.infer<typeof loanFormSchema>;

// API Utilities
const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

export const getToken = (): string => {
  return (
    localStorage.getItem("auth_token") || localStorage.getItem("token") || ""
  );
};

export const apiClient = async <T>(endpoint: string, method = "POST", body?: any): Promise<T> => {
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

export const getUserId = () => {
  const authUser = localStorage.getItem("auth_user");
  return authUser ? JSON.parse(authUser)?.userId : null;
};

export const getLoanTypeFromParam = (loanType: string) => {
  switch (loanType) {
    case "lap":
      return "LAP";
    case "bt-topup":
      return "BT_TOPUP";
    default:
      return "HOME_LOAN";
  }
};