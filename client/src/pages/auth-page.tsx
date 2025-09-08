import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { Country, State, City } from "country-state-city";

import { authService, LoginCredentials } from "../lib/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import OAuth from "./OAuth";

const registerSchema = z
  .object({
    user: z.object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Invalid email address"),
      phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits"),
    }),
    roleData: z.object({
      roleType: z.enum(["USER", "BUILDER", "BROKER", "CA", "ADMIN"], {
        required_error: "You need to select a role.",
      }),
      companyName: z.string().optional(),
      location: z.object({
        country: z.string().min(1, "Country is required"),
        state: z.string().min(1, "State is required"),
        city: z.string().min(1, "City is required"),
        pincode: z
          .string()
          .min(6, "Pincode must be 6 digits")
          .max(6, "Pincode must be 6 digits"),
        addressLine1: z.string().min(1, "Address is required"),
      }),
    }),
  })
  .superRefine(({ user, roleData }, ctx) => {
    if (
      roleData.roleType === "BUILDER" &&
      (!roleData.companyName || roleData.companyName.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Company name is required for Builders",
        path: ["roleData.companyName"],
      });
    }
  });

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export const otpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

export const resetSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string().min(6, "Confirm your new password"),
    source: z.string().min(1, "Source is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

// Forgot Password
const onForgotSubmit = (data: any) => {
  forgotMutation.mutate({ email: data.email });
};

type RegisterFormData = z.infer<typeof registerSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [, navigate] = useLocation();
  const [user, setUser] = useState(authService.getUser());
  const [userEmail, setUserEmail] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (response) => {
      toast.success(response.message || "Login successful!");
      setUser(authService.getUser());
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Login failed. Please check your credentials."
      );
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: Omit<RegisterFormData, "confirmPassword">) => {
      return axios.post(
        "http://homobie.ap-south-1.elasticbeanstalk.com/register/user",
        data
      );
    },
    onSuccess: () => {
      toast.success("Account created successfully! Please log in.");
      setActiveTab("login");
      registerForm.reset();
    },
    onError: (error: unknown) => {
      let errorMessage = "An unexpected error occurred.";

      if (axios.isAxiosError(error) && error.response?.data) {
        const responseData = error.response.data;
        if (responseData.message) {
          errorMessage = responseData.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });

  const forgotMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const res = await axios.post(
        `http://homobie.ap-south-1.elasticbeanstalk.com/request-forgotPassword`,
        null,
        {
          params: {
            email: data.email,
          },
        }
      );
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success("OTP sent to your email! Please check your inbox.");
      setUserEmail(variables.email); // Store the email
      setActiveTab("otp"); // Switch to OTP tab after successful request
      // Pre-fill the OTP form with the email
      otpForm.setValue("email", variables.email);
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: {
      email: string;
      newPassword: string;
      source: string;
    }) => {
      const res = await axios.post(
        `http://homobie.ap-south-1.elasticbeanstalk.com/reset-password`,
        null,
        {
          params: {
            email: data.email,
            newPassword: data.newPassword,
            source: data.source,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password has been reset successfully!");
      setActiveTab("login");
      // Reset forms
      resetForm.reset();
      forgotForm.reset();
      otpForm.reset();
      setUserEmail("");
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ||
          "Something went wrong while resetting password"
      );
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      },
      roleData: {
        roleType: "USER",
        companyName: "",
        location: {
          country: "",
          state: "",
          city: "",
          pincode: "",
          addressLine1: "",
        },
      },
    },
  });
  const otpMutation = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const res = await axios.post(
        `http://homobie.ap-south-1.elasticbeanstalk.com/verify-Otp`,
        null,
        {
          params: {
            email: data.email,
            otp: data.otp,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("OTP verified successfully!");
      setActiveTab("reset");
      resetForm.setValue("email", userEmail);
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Invalid OTP. Please try again."
      );
    },
  });
  const forgotForm = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });
  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });
  const selectedRole = registerForm.watch("roleData.roleType");

  useEffect(() => {
    if (user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    const { ...payload } = data;
    registerMutation.mutate(payload);
  };
  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
      newPassword: "",
      confirmNewPassword: "",
      source: "WEB", // default (can be dynamic e.g. "APP")
    },
  });

  const onResetSubmit = (data: any) => {
    resetMutation.mutate({
      email: data.email,
      newPassword: data.newPassword,
      source: data.source,
    });
  };
  const onOtpSubmit = (data: any) => {
    otpMutation.mutate({
      email: data.email,
      otp: data.otp,
    });
  };

  return (
    <div className="pt-20 ">
      <Toaster position="top-right" richColors />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-[70%]">
              <Tabs
                defaultValue="login"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <Card className="w-full max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center text-2xl font-bold tracking-tight">
                      <Shield className="w-8 h-8 mr-2" />
                      {activeTab === "login"
                        ? "Welcome Back"
                        : activeTab === "register"
                        ? "Create an Account"
                        : activeTab === "forgot"
                        ? "Forgot Password"
                        : activeTab === "otp"
                        ? "Verify OTP"
                        : "Update Password"}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {activeTab === "login" && "Please log in to continue"}
                      {activeTab === "register" &&
                        "Please create an account to continue"}
                      {activeTab === "forgot" &&
                        "Enter your email to reset your password"}
                      {activeTab === "otp" &&
                        "Enter the OTP sent to your email"}
                      {activeTab === "update" && "Enter your new password"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                      <Form {...loginForm}>
                        <form
                          onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                          className="space-y-6  text-white p-6 rounded-lg"
                        >
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Username
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your username"
                                    className="bg-transparent text-white border border-white placeholder-gray-400 focus:ring-white focus:border-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Password
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="Your password"
                                    className="bg-transparent text-white border border-white placeholder-gray-400 focus:ring-white focus:border-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full disabled:opacity-50"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending
                              ? "Logging in..."
                              : "Login"}
                          </Button>
                          <OAuth />
                          <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-[#4f46e5] p-1 h-auto font-normal hover:bg-transparent"
                              onClick={() => setActiveTab("forgot")}
                            >
                              Forgot Password?
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </TabsContent>

                    {/* Forgot Password*/}
                    <TabsContent value="forgot">
                      <Form {...forgotForm}>
                        <form
                          onSubmit={forgotForm.handleSubmit((data) =>
                            forgotMutation.mutate(data)
                          )}
                          className="space-y-6 bg-transparent text-white p-6 rounded-lg"
                        >
                          <FormField
                            control={forgotForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Email Address
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="bg-transparent text-white border border-white placeholder-gray-400 focus:ring-white focus:border-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full disabled:opacity-50"
                            disabled={forgotMutation.isPending}
                          >
                            {forgotMutation.isPending
                              ? "Sending..."
                              : "Send OTP"}
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-[#4f46e5] hover:text-black"
                            onClick={() => setActiveTab("login")}
                          >
                            Back to Login
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>

                    {/* OTP */}
                    <TabsContent value="otp">
                      <Form {...otpForm}>
                        <form
                          onSubmit={otpForm.handleSubmit((data) =>
                            otpMutation.mutate(data)
                          )}
                          className="space-y-6 text-white p-6 rounded-lg"
                        >
                          <div className="text-center mb-4">
                            <p className="text-gray-300 text-sm">
                              We've sent a 6-digit OTP to:{" "}
                              <span className="font-medium text-white">
                                {userEmail}
                              </span>
                            </p>
                          </div>

                          {/* Hidden email field - auto-filled */}
                          <FormField
                            control={otpForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="hidden">
                                <FormControl>
                                  <Input type="hidden" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={otpForm.control}
                            name="otp"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Enter OTP
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    className="bg-transparent text-white border border-white placeholder-gray-400 focus:ring-white focus:border-white text-center text-lg tracking-widest"
                                    maxLength={6}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <div className="text-center">
                            <p className="text-gray-400 text-sm mb-2">
                              Didn't receive the code?
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-[#4f46e5] text-sm font-medium hover:text-indigo-400 p-0 h-auto"
                              onClick={() => {
                                // Resend OTP using the stored email
                                if (userEmail) {
                                  forgotMutation.mutate({ email: userEmail });
                                }
                              }}
                              disabled={forgotMutation.isPending}
                            >
                              {forgotMutation.isPending
                                ? "Sending..."
                                : "Resend OTP"}
                            </Button>
                          </div>

                          <Button
                            type="submit"
                            className="w-full disabled:opacity-50"
                            disabled={otpMutation.isPending}
                          >
                            {otpMutation.isPending
                              ? "Verifying..."
                              : "Verify OTP"}
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-[#4f46e5] hover:text-black"
                            onClick={() => setActiveTab("forgot")}
                          >
                            Back to Email
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>

                    {/* Reset Password */}
                    <TabsContent value="reset">
                      <Form {...resetForm}>
                        <form
                          onSubmit={resetForm.handleSubmit((data) =>
                            resetMutation.mutate(data)
                          )}
                          className="space-y-6 bg-transparent text-white p-6 rounded-lg"
                        >
                          <FormField
                            control={resetForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Email Address
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="bg-gtransparent text-white border border-white placeholder-gray-400 focus:ring-white focus:border-white"
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={resetForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  New Password
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="Enter your new password"
                                    className="bg-transparent text-white border border-white placeholder-gray-400 focus:ring-white focus:border-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={resetForm.control}
                            name="confirmNewPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Confirm New Password
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="Confirm your new password"
                                    className="bg-transparent text-white border border-white placeholder-gray-400 focus:ring-white focus:border-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          {/* Hidden source field with default value */}
                          <FormField
                            control={resetForm.control}
                            name="source"
                            render={({ field }) => (
                              <FormItem className="hidden">
                                <FormControl>
                                  <Input type="hidden" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full disabled:opacity-50"
                            disabled={resetMutation.isPending}
                          >
                            {resetMutation.isPending
                              ? "Resetting..."
                              : "Reset Password"}
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-[#4f46e5] hover:text-black"
                            onClick={() => setActiveTab("login")}
                          >
                            Back to Login
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>

                    <TabsContent value="register">
                      <Form {...registerForm}>
                        <form
                          onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                          className="space-y-4 text-white p-2 rounded-md "
                        >
                          {/* First + Last Name */}
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="user.firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    First Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="John"
                                      className="bg-transparent text-white border border-white placeholder-gray-400"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="user.lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    Last Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Doe"
                                      className="bg-transparent text-white border border-white placeholder-gray-400"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Email */}
                          <FormField
                            control={registerForm.control}
                            name="user.email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    className="bg-transparent text-white border border-white placeholder-gray-400"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          {/* Phone */}
                          <FormField
                            control={registerForm.control}
                            name="user.phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Phone Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your phone number"
                                    className="bg-transparent text-white border border-white placeholder-gray-400"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          {/* Role */}
                          <FormField
                            control={registerForm.control}
                            name="roleData.roleType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Role
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="text-white border border-white">
                                      <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-black text-white border border-white max-h-60 overflow-y-auto">
                                    <SelectItem
                                      value="USER"
                                      className="hover:bg-gray-800"
                                    >
                                      Client
                                    </SelectItem>
                                    <SelectItem
                                      value="BUILDER"
                                      className="hover:bg-gray-800"
                                    >
                                      Builder
                                    </SelectItem>
                                    <SelectItem
                                      value="BROKER"
                                      className="hover:bg-gray-800"
                                    >
                                      Broker
                                    </SelectItem>
                                    <SelectItem
                                      value="CA"
                                      className="hover:bg-gray-800"
                                    >
                                      Chartered Accountant
                                    </SelectItem>
                                    <SelectItem
                                      value="ADMIN"
                                      className="hover:bg-gray-800"
                                    >
                                      Admin
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          {/* Company (only Builder) */}
                          {selectedRole === "BUILDER" && (
                            <FormField
                              control={registerForm.control}
                              name="roleData.companyName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    Company Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Your company name"
                                      className="bg-transparent text-white border border-white placeholder-gray-400"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          )}

                          {/* Address Details */}
                          <h3 className="text-sm font-medium pt-2 text-white">
                            Address Details
                          </h3>

                          <FormField
                            control={registerForm.control}
                            name="roleData.location.addressLine1"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Address
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Street address, building..."
                                    className="bg-transparent text-white border border-white placeholder-gray-400"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          {/* Country / State / City */}
                          <div className="grid grid-cols-3 gap-4">
                            {/* Country */}
                            <FormField
                              control={registerForm.control}
                              name="roleData.location.country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    Country
                                  </FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      setSelectedCountry(value);
                                      setSelectedState("");
                                      setSelectedCity("");
                                    }}
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="text-white border border-white">
                                        <SelectValue placeholder="Select Country" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-black text-white border border-white max-h-60 overflow-y-auto">
                                      {Country.getAllCountries().map((c) => (
                                        <SelectItem
                                          key={c.isoCode}
                                          value={c.isoCode}
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

                            {/* State */}
                            <FormField
                              control={registerForm.control}
                              name="roleData.location.state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    State
                                  </FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      setSelectedState(value);
                                      setSelectedCity("");
                                    }}
                                    value={field.value}
                                    disabled={!selectedCountry}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="text-white border border-white">
                                        <SelectValue placeholder="Select State" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-black text-white border border-white max-h-60 overflow-y-auto">
                                      {selectedCountry &&
                                        State.getStatesOfCountry(
                                          selectedCountry
                                        ).map((s) => (
                                          <SelectItem
                                            key={s.isoCode}
                                            value={s.isoCode}
                                          >
                                            {s.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />

                            {/* City */}
                            <FormField
                              control={registerForm.control}
                              name="roleData.location.city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    City
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={!selectedState}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="text-white border border-white">
                                        <SelectValue placeholder="Select City" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-black text-white border border-white max-h-60 overflow-y-auto">
                                      {selectedCountry &&
                                        selectedState &&
                                        City.getCitiesOfState(
                                          selectedCountry,
                                          selectedState
                                        ).map((city) => (
                                          <SelectItem
                                            key={city.name}
                                            value={city.name}
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
                          </div>

                          {/* Pincode */}
                          <FormField
                            control={registerForm.control}
                            name="roleData.location.pincode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Pincode
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Pincode"
                                    className="bg-transparent text-white border border-white placeholder-gray-400"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          {/* Submit */}
                          <Button
                            type="submit"
                            className="w-full bg-white text-black hover:bg-gray-200"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending
                              ? "Creating Account..."
                              : "Create Account"}
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </CardContent>
                </Card>
              </Tabs>
            </div>
            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                Welcome to Homobie
              </h1>
              <p className="text-lg text-white">
                Your trusted partner for all financial solutions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-white p-3 rounded-full mr-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-white">
                    <h3 className=" font-semibold text-lg">Secure Account</h3>
                    <p className="">
                      Your financial data is protected with bank-level security.
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-white p-3 rounded-full mr-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-white">
                    <h3 className="font-semibold text-lg">
                      Customized Solutions
                    </h3>
                    <p className="text-white">
                      Get personalized loan and investment recommendations.
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-white p-3 rounded-full mr-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-white">
                    <h3 className="font-semibold text-lg">24/7 Dashboard</h3>
                    <p className="text-white">
                      Monitor all your finances in one place, anytime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
