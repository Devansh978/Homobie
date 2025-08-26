import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Variants } from "framer-motion";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(rate: number): string {
  return `${rate.toFixed(1)}%`;
}

export function calculateEMI(
  principal: number,
  interestRate: number,
  tenureYears: number,
): number {
  const monthlyRate = interestRate / 12 / 100;
  const tenureMonths = tenureYears * 12;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return Math.round(emi);
}

export function calculateSIPReturns(
  monthlyInvestment: number,
  expectedReturnRate: number,
  tenureYears: number,
): {
  totalInvestment: number;
  estimatedReturns: number;
  totalValue: number;
} {
  const monthlyRate = expectedReturnRate / 12 / 100;
  const months = tenureYears * 12;
  const invested = monthlyInvestment * months;

  const futureValue =
    monthlyInvestment *
    (((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate)) /
      monthlyRate);

  const returns = futureValue - invested;

  return {
    totalInvestment: invested,
    estimatedReturns: Math.round(returns),
    totalValue: Math.round(futureValue),
  };
}

export function getQueryParam(param: string): string | null {
  if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
  }
  return null;
}

export function getLoanTypeLabel(type: string): string {
  const types: Record<string, string> = {
    "home-loan": "Home Loan",
    lap: "Loan Against Property",
    "bt-topup": "Balance Transfer Top-Up",
  };

  return types[type] || "Loan";
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getStatusColor(status: string): {
  bg: string;
  text: string;
} {
  switch (status.toLowerCase()) {
    case "approved":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "rejected":
      return { bg: "bg-red-100", text: "text-red-800" };
    case "pending":
      return { bg: "bg-yellow-100", text: "text-yellow-800" };
    case "scheduled":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "completed":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "cancelled":
      return { bg: "bg-red-100", text: "text-red-800" };
    case "active":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "paused":
      return { bg: "bg-orange-100", text: "text-orange-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
}

export const fadeIn = (direction: string, delay: number): Variants => {
  return {
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.5,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

export const staggerContainer = (delayChildren?: number): Variants => {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delayChildren || 0,
      },
    },
  };
};

export const cardHoverEffect: Variants = {
  hover: {
    scale: 1.03,
    boxShadow:
      "0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 10px 10px -5px rgba(255, 255, 255, 0.04)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};
