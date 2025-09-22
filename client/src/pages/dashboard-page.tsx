import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

import { ChatbotButton } from "@/components/layout/chatbot-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  FileText,
  Calendar,
  ChartPie,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Edit2,
  X,
} from "lucide-react";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { getDisplayName } from "@/lib/auth";
import KycSection from "./KycSection";

// Helper functions for time slot storage
const getTimeSlotIdFromStorage = () => {
  return localStorage.getItem("selectedTimeSlotId");
};

const saveTimeSlotIdToStorage = (timeSlotId) => {
  localStorage.setItem("selectedTimeSlotId", timeSlotId);
};

// Helper function to get user data from multiple sources
const getUserData = () => {
  // Method 1: From localStorage 'user' key
  const userFromStorage = localStorage.getItem("user");
  let userData = null;

  if (userFromStorage) {
    try {
      userData = JSON.parse(userFromStorage);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }
  return userData;
};

// Temporary type definitions
type Consultation = {
  id: string;
  consultationId?: string;
  topic: string;
  bookedAt: string;
  preferredDate: string;
  notes?: string;
  status: string;
};

type TimeSlot = {
  id: string;
  timeSlotId: string;
  startTime: string;
  endTime: string;
  slotTime: string;
  isAvailable: boolean;
};

// Helper function to properly convert UTC to local time
const convertUTCToLocal = (utcDateString: string | undefined | null): Date => {
  if (!utcDateString || typeof utcDateString !== "string") {
    console.warn(
      "convertUTCToLocal received invalid date string:",
      utcDateString
    );
    return new Date();
  }

  const utcDate = new Date(utcDateString);

  if (isNaN(utcDate.getTime())) {
    console.warn(
      "convertUTCToLocal received invalid date string:",
      utcDateString
    );
    return new Date();
  }

  if (
    !utcDateString.includes("Z") &&
    !utcDateString.includes("+") &&
    !utcDateString.includes("-", 10)
  ) {
    return new Date(utcDateString + "Z");
  }

  return utcDate;
};

// Helper function to format date/time in local timezone
const formatDateTimeLocal = (dateString: string | undefined | null) => {
  if (!dateString) return "Date not available";

  try {
    const localDate = convertUTCToLocal(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    return localDate.toLocaleString(undefined, options);
  } catch (error) {
    console.error("Error formatting date time:", error);
    return "Invalid date";
  }
};

const formatDateLocal = (dateString: string | undefined | null) => {
  if (!dateString) return "Date not available";

  try {
    const localDate = convertUTCToLocal(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    return localDate.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const formatTimeLocal = (dateString: string | undefined | null) => {
  if (!dateString) return "Time not available";

  try {
    const localDate = convertUTCToLocal(dateString);
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    return localDate.toLocaleTimeString(undefined, options);
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid time";
  }
};

// Enhanced API request helper for consultations
const authenticatedConsultationRequest = async (
  method: string,
  endpoint: string,
  data?: any
) => {
  const BASE_URL = "https://api.homobie.com";

  try {
    const authToken = localStorage.getItem("auth_token");
    const userDataStr = localStorage.getItem("user");
    const userIdFromStorage = localStorage.getItem("userId");

    let userId = userIdFromStorage;
    if (!userId && userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        userId = userData.id;
      } catch (parseError) {
        console.error("Error parsing user data from localStorage:", parseError);
      }
    }

    console.log(`=== ${method} ${endpoint} ===`);
    console.log(
      `Auth Token: ${
        authToken ? `${authToken.substring(0, 20)}...` : "NOT FOUND"
      }`
    );
    console.log(`User ID: ${userId || "NOT FOUND"}`);

    if (!authToken) {
      throw new Error("Authentication token missing");
    }

    if (!userId) {
      throw new Error("User ID missing");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    };

    const config: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = JSON.stringify(data);
      console.log(`Request payload:`, JSON.stringify(data, null, 2));
    }

    const url = `${BASE_URL}${endpoint}`;
    console.log(`Request URL: ${url}`);

    const response = await fetch(url, config);
    console.log(`Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorText = await response.text();
        console.log(`Error response body:`, errorText);
        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage =
              errorData?.message ||
              errorData?.error ||
              errorData?.detail ||
              errorText;
          } catch {
            errorMessage = errorText;
          }
        }
      } catch {
        // Use default error message
      }
      throw new Error(`API Error [${response.status}]: ${errorMessage}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const responseText = await response.text();
      if (responseText) {
        try {
          const responseData = JSON.parse(responseText);
          console.log(`Response data:`, responseData);
          return responseData;
        } catch {
          return { success: true, rawResponse: responseText };
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error(
      `=== REQUEST FAILED: ${
        error instanceof Error ? error.message : "Unknown error"
      } ===`
    );
    throw error;
  }
};

// Consultation Action Dialog Components
const CancelConsultationDialog = ({
  consultation,
  onCancel,
  isLoading,
}: {
  consultation: Consultation;
  onCancel: (consultationId: string, remark: string, reason?: string) => void;
  isLoading: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [cancelRemark, setCancelRemark] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const handleSubmit = () => {
    if (cancelRemark.trim()) {
      const consultationId = consultation.consultationId || consultation.id;
      onCancel(consultationId, cancelRemark, cancelReason);
      setOpen(false);
      setCancelRemark("");
      setCancelReason("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="ml-2"
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-gray-100">
            Cancel Consultation
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to cancel your consultation for "
            {consultation.topic}" scheduled on{" "}
            {formatDateTimeLocal(consultation.preferredDate)}?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="cancelRemark" className="text-gray-200">
              Cancellation Reason (Required)
            </Label>
            <Textarea
              id="cancelRemark"
              placeholder="Please provide a reason for cancellation..."
              value={cancelRemark}
              onChange={(e) => setCancelRemark(e.target.value)}
              className="mt-2 bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="cancelReason" className="text-gray-200">
              Additional Notes (Optional)
            </Label>
            <Input
              id="cancelReason"
              placeholder="Any additional information..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="mt-2 bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="border-gray-600 text-black hover:bg-gray-800"
          >
            Keep Consultation
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!cancelRemark.trim() || isLoading}
          >
            {isLoading ? "Cancelling..." : "Cancel Consultation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RescheduleConsultationDialog = ({
  consultation,
  onReschedule,
  isLoading,
}: {
  consultation: Consultation;
  onReschedule: (
    consultationId: string,
    timeSlotId: string,
    remark: string,
    reason?: string
  ) => void;
  isLoading: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [rescheduleRemark, setRescheduleRemark] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Fetch available slots when date is selected
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate) {
        setAvailableSlots([]);
        return;
      }

      setIsLoadingSlots(true);
      setSlotsError(null);
      try {
        const authToken = localStorage.getItem("auth_token");
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const response = await fetch(
          `https://api.homobie.com/consultation/available-slots?date=${selectedDate}&timezone=${encodeURIComponent(
            timezone
          )}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Available slots response:", data);
          setAvailableSlots(
            Array.isArray(data) ? data : data?.slots || data?.data || []
          );
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch available slots:", errorText);
          setSlotsError("Failed to load available time slots");
          setAvailableSlots([]);
        }
      } catch (error) {
        console.error("Error fetching available slots:", error);
        setSlotsError("Error loading time slots");
        setAvailableSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  const handleSubmit = () => {
    if (selectedDate && selectedTimeSlot && rescheduleRemark.trim()) {
      const consultationId = consultation.consultationId || consultation.id;
      // Use the timeSlotId from the slot object, or get from storage as fallback
      const timeSlotId =
        selectedTimeSlot.timeSlotId ||
        selectedTimeSlot.id ||
        getTimeSlotIdFromStorage();

      if (!timeSlotId) {
        console.error("TimeSlot ID not found");
        return;
      }

      onReschedule(
        consultationId,
        timeSlotId,
        rescheduleRemark,
        rescheduleReason
      );
      setOpen(false);
      setSelectedDate("");
      setSelectedTimeSlot(null);
      setRescheduleRemark("");
      setRescheduleReason("");
    }
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="border-gray-600 text-black hover:bg-gray-800"
        >
          <Edit2 className="h-4 w-4 mr-1" />
          Reschedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-gray-900 border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-gray-100">
            Reschedule Consultation
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Current appointment:{" "}
            {formatDateTimeLocal(consultation.preferredDate)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="newDate" className="text-gray-200">
              New Date
            </Label>
            <Input
              id="newDate"
              type="date"
              min={minDate}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-2 bg-gray-800 border-gray-600 text-gray-100"
            />
          </div>

          {selectedDate && (
            <div>
              <Label htmlFor="newTime" className="text-gray-200">
                New Time
              </Label>
              {isLoadingSlots ? (
                <div className="mt-2 text-sm text-gray-400">
                  Loading available time slots...
                </div>
              ) : slotsError ? (
                <div className="mt-2 text-sm text-red-400">{slotsError}</div>
              ) : availableSlots.length > 0 ? (
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {availableSlots
                    .filter((slot) => slot.isAvailable)
                    .map((slot) => {
                      // Use slotTime if available, otherwise fallback to startTime
                      const slotDateTime = slot.slotTime || slot.startTime;
                      const timeDate = new Date(slotDateTime);

                      if (isNaN(timeDate.getTime())) {
                        console.warn("Invalid slot time:", slotDateTime);
                        return null;
                      }

                      const timeStr = timeDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      });

                      return (
                        <div
                          key={slot.timeSlotId || slot.id}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${
                            selectedTimeSlot?.timeSlotId ===
                            (slot.timeSlotId || slot.id)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "hover:bg-gray-800 border-gray-600 bg-gray-800/50"
                          }`}
                          onClick={() => {
                            setSelectedTimeSlot(slot);
                            // Save the timeSlotId when selected
                            saveTimeSlotIdToStorage(slot.timeSlotId || slot.id);
                          }}
                        >
                          <div className="text-sm font-medium">{timeStr}</div>
                          <div className="text-xs opacity-75">
                            ID: {(slot.timeSlotId || slot.id).substring(0, 8)}
                            ...
                          </div>
                        </div>
                      );
                    })
                    .filter(Boolean)}
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-400">
                  No available time slots for this date
                </div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="rescheduleRemark" className="text-gray-200">
              Reason for Rescheduling (Required)
            </Label>
            <Textarea
              id="rescheduleRemark"
              placeholder="Please provide a reason for rescheduling..."
              value={rescheduleRemark}
              onChange={(e) => setRescheduleRemark(e.target.value)}
              className="mt-2 bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="rescheduleReason" className="text-gray-200">
              Additional Notes (Optional)
            </Label>
            <Input
              id="rescheduleReason"
              placeholder="Any additional information..."
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              className="mt-2 bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="border-gray-600 text-black hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedDate ||
              !selectedTimeSlot ||
              !rescheduleRemark.trim() ||
              isLoading
            }
          >
            {isLoading ? "Rescheduling..." : "Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function DashboardPage() {
  const displayName = getDisplayName();
  const [actionErrors, setActionErrors] = useState<{ [key: string]: string }>(
    {}
  );

  // Fetch consultations with updated API call
  const {
    data: consultations = [],
    isLoading: isLoadingConsultations,
    refetch: refetchConsultations,
    error: consultationsError,
  } = useQuery<Consultation[]>({
    queryKey: ["consultations"],
    queryFn: async () => {
      const authToken = localStorage.getItem("auth_token");
      const userDataStr = localStorage.getItem("user");
      const userIdFromStorage = localStorage.getItem("userId");

      let userId = userIdFromStorage;
      if (!userId && userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          userId = userData.id;
        } catch (parseError) {
          console.error(
            "Error parsing user data from localStorage:",
            parseError
          );
        }
      }

      if (!authToken || !userId) {
        throw new Error("Authentication required");
      }

      try {
        const response = await authenticatedConsultationRequest(
          "GET",
          `/consultation/all-bookings?userId=${userId}`
        );
        return Array.isArray(response)
          ? response
          : response?.consultations || response?.data || [];
      } catch (error) {
        console.error("Error fetching consultations:", error);
        throw error;
      }
    },
    enabled: !!localStorage.getItem("auth_token"),
    retry: 2,
    onError: (error) => {
      console.error("Consultations query error:", error);
    },
  });

  // Cancel consultation mutation
  const cancelConsultationMutation = useMutation({
    mutationFn: async ({
      consultationId,
      cancelRemark,
      cancelReason,
    }: {
      consultationId: string;
      cancelRemark: string;
      cancelReason?: string;
    }) => {
      const authToken = localStorage.getItem("auth_token");
      const userDataStr = localStorage.getItem("user");
      const userIdFromStorage = localStorage.getItem("userId");

      let userId = userIdFromStorage;
      if (!userId && userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          userId = userData.id;
        } catch (parseError) {
          console.error(
            "Error parsing user data from localStorage:",
            parseError
          );
        }
      }

      if (!authToken || !userId) {
        throw new Error("Authentication required");
      }

      if (!consultationId) {
        throw new Error("Consultation ID is required");
      }

      const payload = {
        consultationId,
        userId,
        cancelRemark,
        cancelReason: cancelReason || "",
        cancelledAt: new Date().toISOString(),
        cancelledBy: userId,
      };

      console.log("Cancel consultation payload:", payload);
      return await authenticatedConsultationRequest(
        "POST",
        "/consultation/cancel",
        payload
      );
    },
    onSuccess: () => {
      refetchConsultations();
      console.log("Consultation cancelled successfully");
      setActionErrors({});
    },
    onError: (error) => {
      console.error("Error cancelling consultation:", error);
      setActionErrors((prev) => ({
        ...prev,
        cancel:
          error instanceof Error
            ? error.message
            : "Failed to cancel consultation",
      }));
    },
  });

  // Reschedule consultation mutation
  const rescheduleConsultationMutation = useMutation({
    mutationFn: async ({
      consultationId,
      timeSlotId,
      rescheduleRemark,
      rescheduleReason,
    }: {
      consultationId: string;
      timeSlotId: string;
      rescheduleRemark: string;
      rescheduleReason?: string;
    }) => {
      const authToken = localStorage.getItem("auth_token");
      const userDataStr = localStorage.getItem("user");
      const userIdFromStorage = localStorage.getItem("userId");

      let userId = userIdFromStorage;
      if (!userId && userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          userId = userData.id;
        } catch (parseError) {
          console.error(
            "Error parsing user data from localStorage:",
            parseError
          );
        }
      }

      if (!authToken || !userId) {
        throw new Error("Authentication required");
      }

      if (!consultationId || !timeSlotId) {
        throw new Error("Consultation ID and TimeSlot ID are required");
      }

      const payload = {
        consultationId,
        userId,
        timeSlotId,
        rescheduleRemark,
        rescheduleReason: rescheduleReason || "",
        rescheduledAt: new Date().toISOString(),
        rescheduledBy: userId,
      };

      console.log("Reschedule consultation payload:", payload);
      return await authenticatedConsultationRequest(
        "POST",
        "/consultation/reschedule",
        payload
      );
    },
    onSuccess: () => {
      refetchConsultations();
      console.log("Consultation rescheduled successfully");
      setActionErrors({});
    },
    onError: (error) => {
      console.error("Error rescheduling consultation:", error);
      setActionErrors((prev) => ({
        ...prev,
        reschedule:
          error instanceof Error
            ? error.message
            : "Failed to reschedule consultation",
      }));
    },
  });

  // Helper functions for consultation actions
  const handleCancelConsultation = (
    consultationId: string,
    remark: string,
    reason?: string
  ) => {
    cancelConsultationMutation.mutate({
      consultationId,
      cancelRemark: remark,
      cancelReason: reason,
    });
  };

  const handleRescheduleConsultation = (
    consultationId: string,
    timeSlotId: string,
    remark: string,
    reason?: string
  ) => {
    rescheduleConsultationMutation.mutate({
      consultationId,
      timeSlotId,
      rescheduleRemark: remark,
      rescheduleReason: reason,
    });
  };

  // Mock data for other sections
  const loanApplications = [];
  const sipInvestments = [];
  const kycDocuments = [];
  const transactions = [];
  const isKycComplete = false;

  // Get next consultation if any
  const upcomingConsultation = consultations
    .filter((c) => c.status === "scheduled" || c.status === "BOOKED")
    .sort(
      (a, b) =>
        new Date(a.preferredDate).getTime() -
        new Date(b.preferredDate).getTime()
    )[0];

  return (
    <div className="pt-20 min-h-screen bg-gray-900 text-gray-100">
      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {displayName}</p>
          </div>

          {/* Error Messages */}
          {actionErrors.cancel && (
            <Alert className="mb-4 bg-red-900/50 border-red-700">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertTitle className="text-red-300">
                Cancellation Failed
              </AlertTitle>
              <AlertDescription className="text-red-400">
                {actionErrors.cancel}
              </AlertDescription>
            </Alert>
          )}

          {actionErrors.reschedule && (
            <Alert className="mb-4 bg-red-900/50 border-red-700">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertTitle className="text-red-300">
                Rescheduling Failed
              </AlertTitle>
              <AlertDescription className="text-red-400">
                {actionErrors.reschedule}
              </AlertDescription>
            </Alert>
          )}

          {!isKycComplete && (
            <Alert className="mb-6 bg-amber-900/50 border-amber-700">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <AlertTitle className="text-amber-300">
                Complete your KYC
              </AlertTitle>
              <AlertDescription className="text-amber-400">
                Your KYC verification is pending. Please upload your identity
                documents to unlock all features.
                <div className="mt-2">
                  <Link href="/dashboard?tab=kyc">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-600 text-amber-300 hover:bg-amber-900/30"
                    >
                      Upload Documents
                    </Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total Loan Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-primary/20 p-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-100">₹0</div>
                    <p className="text-xs text-gray-400">0 applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  SIP Investments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-primary/20 p-2">
                    <ChartPie className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-100">
                      ₹0 <span className="text-xs ml-1">/ month</span>
                    </div>
                    <p className="text-xs text-gray-400">No active SIPs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Next Consultation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-primary/20 p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    {upcomingConsultation ? (
                      <>
                        <div className="text-base font-bold text-gray-100">
                          {formatDateLocal(upcomingConsultation.preferredDate)}
                        </div>
                        <p className="text-xs text-gray-400">
                          {upcomingConsultation.topic}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-base font-medium text-gray-100">
                          No scheduled consultations
                        </div>
                        <Link href="/consultation">
                          <Button
                            size="sm"
                            variant="link"
                            className="h-auto p-0 text-primary hover:text-primary/80"
                          >
                            Book now
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="consultations" className="w-full">
            <TabsList className="mb-6 bg-gray-800 border-gray-700">
              <TabsTrigger
                value="consultations"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100 text-gray-400"
              >
                Consultations
              </TabsTrigger>
              <TabsTrigger
                value="loans"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100 text-gray-400"
              >
                Loan Applications
              </TabsTrigger>
              <TabsTrigger
                value="investments"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100 text-gray-400"
              >
                SIP Investments
              </TabsTrigger>
              <TabsTrigger
                value="kyc"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100 text-gray-400"
              >
                KYC Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="consultations">
              {consultationsError && (
                <Alert className="mb-4 bg-red-900/50 border-red-700">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertTitle className="text-red-300">
                    Failed to Load Consultations
                  </AlertTitle>
                  <AlertDescription className="text-red-400">
                    {consultationsError instanceof Error
                      ? consultationsError.message
                      : "Unknown error occurred"}
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetchConsultations()}
                        className="border-red-600 text-red-300 hover:bg-red-900/30"
                      >
                        Retry
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {isLoadingConsultations ? (
                <div className="text-center py-8 text-gray-400">
                  Loading your consultations...
                </div>
              ) : consultations.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700 text-center p-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-200">
                    No Consultations Booked
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Book your free financial consultation with our experts.
                  </p>
                  <Link href="/consultation">
                    <Button>Book Consultation</Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {consultations.map((consultation) => {
                    const consultationId =
                      consultation.consultationId || consultation.id;
                    const isCancelling =
                      cancelConsultationMutation.isPending &&
                      cancelConsultationMutation.variables?.consultationId ===
                        consultationId;
                    const isRescheduling =
                      rescheduleConsultationMutation.isPending &&
                      rescheduleConsultationMutation.variables
                        ?.consultationId === consultationId;
                    const isActionPending = isCancelling || isRescheduling;

                    return (
                      <Card
                        key={consultationId}
                        className={`bg-gray-800 border-gray-700 ${
                          isActionPending ? "opacity-60" : ""
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-3">
                                <Badge
                                  className={`mr-3 ${
                                    getStatusColor(consultation.status).bg
                                  } ${
                                    getStatusColor(consultation.status).text
                                  }`}
                                >
                                  {consultation.status.charAt(0).toUpperCase() +
                                    consultation.status.slice(1)}
                                </Badge>
                                <h3 className="text-lg font-semibold text-gray-100">
                                  {consultation.topic}
                                </h3>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm font-medium text-black">
                                    Booked On
                                  </p>
                                  <p className="text-base text-gray-100">
                                    {formatDateLocal(consultation.bookedAt)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-black">
                                    Preferred Date & Time
                                  </p>
                                  <p className="text-base text-gray-100">
                                    {formatDateTimeLocal(
                                      consultation.preferredDate
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-black">
                                    Consultation ID
                                  </p>
                                  <p className="text-xs text-gray-400 font-mono bg-gray-700 px-2 py-1 rounded">
                                    {consultationId || "Not available"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-black">
                                    Local Time Zone
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {
                                      Intl.DateTimeFormat().resolvedOptions()
                                        .timeZone
                                    }
                                  </p>
                                </div>
                              </div>

                              {consultation.notes && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium text-black">
                                    Notes
                                  </p>
                                  <p className="text-sm text-gray-400 bg-gray-700 p-3 rounded-md">
                                    {consultation.notes}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="lg:ml-6 lg:w-48 flex flex-col justify-between">
                              {(consultation.status === "scheduled" ||
                                consultation.status === "BOOKED") && (
                                <div className="mb-4 p-3 bg-blue-900/50 rounded-lg border border-blue-700">
                                  <div className="flex items-center text-sm text-blue-300 mb-2">
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span className="font-medium">
                                      Upcoming
                                    </span>
                                  </div>
                                  <p className="text-xs text-blue-400">
                                    {formatTimeLocal(
                                      consultation.preferredDate
                                    )}
                                  </p>
                                </div>
                              )}

                              <div className="flex flex-col space-y-2">
                                {(consultation.status === "scheduled" ||
                                  consultation.status === "BOOKED") && (
                                  <>
                                    <RescheduleConsultationDialog
                                      consultation={consultation}
                                      onReschedule={
                                        handleRescheduleConsultation
                                      }
                                      isLoading={isRescheduling}
                                    />
                                    <CancelConsultationDialog
                                      consultation={consultation}
                                      onCancel={handleCancelConsultation}
                                      isLoading={isCancelling}
                                    />
                                  </>
                                )}

                                {consultation.status === "completed" && (
                                  <Button
                                    variant="outline"
                                    className="border-gray-600 text-black hover:bg-white"
                                  >
                                    View Summary
                                  </Button>
                                )}

                                {consultation.status === "cancelled" && (
                                  <Link href="/consultation">
                                    <Button
                                      variant="outline"
                                      className="border-gray-600 text-black hover:bg-white"
                                    >
                                      Book Again
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>

                          {isCancelling && (
                            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400 mr-2"></div>
                                <p className="text-sm text-red-300">
                                  Cancelling consultation...
                                </p>
                              </div>
                            </div>
                          )}

                          {isRescheduling && (
                            <div className="mt-4 p-3 bg-blue-900/50 border border-blue-700 rounded-md">
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                                <p className="text-sm text-blue-300">
                                  Rescheduling consultation...
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 text-center">
                <Link href="/consultation">
                  <Button>Book New Consultation</Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="loans">
              <Card className="bg-gray-800 border-gray-700 text-center p-8">
                <FileText className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-200">
                  No Loan Applications
                </h3>
                <p className="text-gray-400 mb-4">
                  You haven't applied for any loans yet.
                </p>
                <Link to="/loan-application">
                  <Button>Apply for a Loan</Button>
                </Link>
              </Card>
            </TabsContent>

            <TabsContent value="investments">
              <Card className="bg-gray-800 border-gray-700 text-center p-8">
                <ChartPie className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-200">
                  No Active SIP Investments
                </h3>
                <p className="text-gray-400 mb-4">
                  Start your wealth creation journey with regular SIP
                  investments.
                </p>
                <Link to="/sip">
                  <Button>Start SIP Now</Button>
                </Link>
              </Card>
            </TabsContent>

            <TabsContent value="kyc">
              <KycSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <ChatbotButton />
    </div>
  );
}
