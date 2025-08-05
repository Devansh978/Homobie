import { z } from 'zod';

export const insertLoanApplicationSchema = z.object({
  loanType: z.string(),
  amount: z.number(),
  tenure: z.number(),
  interestRate: z.number(),
  monthlyIncome: z.number(),
  purpose: z.string(),
  employmentType: z.enum(["salaried", "self-employed"]),
  propertyValue: z.number().optional(),
  propertyAddress: z.string().optional(),
  existingLoanDetails: z.any().optional(),
  userId: z.number().optional(),
});

export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string(),
});
