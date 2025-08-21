import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import axios from "axios";

// --- Importing from your auth service (for login and user state) ---
import { authService, LoginCredentials } from "../lib/auth"; // Adjust path if needed

// Import shadcn/ui components
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

// --- Schema definitions (unchanged) ---
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

type RegisterFormData = z.infer<typeof registerSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [, navigate] = useLocation();
  const [user, setUser] = useState(authService.getUser());

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    // MODIFICATION: The onSuccess callback receives the response from the mutation function.
    // We capture it here as 'response' to access the backend message.
    onSuccess: (response) => {
      // MODIFICATION: Use the message from the backend response.
      // Provide a fallback text in case the message is not present.
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
        "https://homobiebackend-railway-production.up.railway.app/register/user",
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

  // ... rest of your component is unchanged

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

  return (
    <div className="pt-20 bg-black">
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
                        : "Create an Account"}
                    </CardTitle>
                    <CardDescription className="text-center">
                      Please log in or create an account to continue
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
                          className="space-y-6 bg-black text-white p-6 rounded-lg"
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
                                    className="bg-black text-white border border-white placeholder-gray-400 focus:ring-white focus:border-white"
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
                                    className="bg-black text-white border border-white placeholder-gray-400 focus:ring-white focus:border-white"
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
                        </form>
                      </Form>
                    </TabsContent>

                    <TabsContent value="register">
                      <Form {...registerForm}>
                        <form
                          onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                          className="space-y-4 bg-black text-white border border-white p-6 rounded-md"
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
                                      className="bg-black text-white border border-white placeholder-gray-400"
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
                                      className="bg-black text-white border border-white placeholder-gray-400"
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
                                    className="bg-black text-white border border-white placeholder-gray-400"
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
                                    className="bg-black text-white border border-white placeholder-gray-400"
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
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-black text-white border border-white">
                                      <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-black text-white border border-white">
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

                          {/* Company (only for Builder) */}
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
                                      className="bg-black text-white border border-white placeholder-gray-400"
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
                                    className="bg-black text-white border border-white placeholder-gray-400"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="roleData.location.city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    City
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="City"
                                      className="bg-black text-white border border-white placeholder-gray-400"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="roleData.location.state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    State
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="State"
                                      className="bg-black text-white border border-white placeholder-gray-400"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
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
                                      className="bg-black text-white border border-white placeholder-gray-400"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="roleData.location.country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    Country
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Country"
                                      className="bg-black text-white border border-white placeholder-gray-400"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button
                            type="submit"
                            className="w-full"
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
                  <div>
                    <h3 className="font-semibold text-lg">Secure Account</h3>
                    <p className="text-white">
                      Your financial data is protected with bank-level security.
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-white p-3 rounded-full mr-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
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
                  <div>
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
