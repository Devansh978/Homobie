import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  User, FileText, Calendar, Home, DollarSign, CircleCheck, CircleX, FileSearch, 
  Users, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Search,
  InfoIcon, CheckIcon, XIcon
} from "lucide-react";
import { LoanApplication, User as UserType, Consultation, KycDocument } from "@shared/schema";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
  const [selectedConsultationId, setSelectedConsultationId] = useState<number | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [consultationStatusDialogOpen, setConsultationStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [newConsultationStatus, setNewConsultationStatus] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch all loan applications
  const { 
    data: loanApplications = [], 
    isLoading: isLoadingLoans 
  } = useQuery<LoanApplication[]>({
    queryKey: ["/api/admin/loan-applications"],
  });

  // Fetch all users
  const { 
    data: users = [], 
    isLoading: isLoadingUsers 
  } = useQuery<UserType[]>({
    queryKey: ["/api/admin/users"],
  });

  // Fetch all consultations
  const { 
    data: consultations = [], 
    isLoading: isLoadingConsultations 
  } = useQuery<Consultation[]>({
    queryKey: ["/api/admin/consultations"],
  });

  // Fetch analytics data
  const { 
    data: analytics = {
      totalUsers: 0,
      loanStats: { total: 0, pending: 0, approved: 0, rejected: 0 },
      consultations: { total: 0, scheduled: 0, completed: 0 },
      sipInvestments: { total: 0, active: 0 },
      auditLogs: { total: 0 },
    }, 
    isLoading: isLoadingAnalytics 
  } = useQuery({
    queryKey: ["/api/admin/analytics"],
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: async (data: { id: number; status: string; rejectionReason?: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/loan-applications/${data.id}`, { 
        status: data.status,
        rejectionReason: data.rejectionReason
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/loan-applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      setStatusDialogOpen(false);
      setRejectionReason("");
    },
  });
  
  // Consultation status update mutation
  const consultationStatusMutation = useMutation({
    mutationFn: async (data: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/consultations/${data.id}`, { 
        status: data.status
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/consultations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      setConsultationStatusDialogOpen(false);
    },
  });

  // Filter loans based on search query
  const filteredLoans = loanApplications.filter(loan => {
    if (!searchQuery) return true;
    
    const loanUser = users.find(u => u.id === loan.userId);
    const searchLower = searchQuery.toLowerCase();
    
    return (
      loan.loanType.toLowerCase().includes(searchLower) ||
      (loanUser?.fullName && loanUser.fullName.toLowerCase().includes(searchLower)) ||
      (loanUser?.username && loanUser.username.toLowerCase().includes(searchLower)) ||
      loan.status.toLowerCase().includes(searchLower) ||
      String(loan.amount).includes(searchLower)
    );
  });

  // Handle loan status change
  const handleStatusChange = (id: number, status: string) => {
    setSelectedLoanId(id);
    setNewStatus(status);
    if (status === 'rejected') {
      setRejectionReason("");
    }
    setStatusDialogOpen(true);
  };

  // Handle loan status update submission
  const handleStatusUpdate = () => {
    if (selectedLoanId && newStatus) {
      statusMutation.mutate({ 
        id: selectedLoanId, 
        status: newStatus,
        rejectionReason: newStatus === 'rejected' ? rejectionReason : undefined
      });
    }
  };
  
  // Handle consultation status change
  const handleConsultationStatusChange = (id: number, status: string) => {
    setSelectedConsultationId(id);
    setNewConsultationStatus(status);
    setConsultationStatusDialogOpen(true);
  };
  
  // Handle consultation status update submission
  const handleConsultationStatusUpdate = () => {
    if (selectedConsultationId && newConsultationStatus) {
      consultationStatusMutation.mutate({
        id: selectedConsultationId,
        status: newConsultationStatus
      });
    }
  };

  // Get user by ID
  const getUserById = (userId: number) => {
    return users.find(user => user.id === userId);
  };

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <div>
        <main className="flex items-center justify-center min-h-[80vh]">
          <Alert className="max-w-md">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access the admin panel.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div>
      <main className="bg-neutral-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800">Admin Panel</h1>
              <p className="text-neutral-600">Manage loan applications, users, and more</p>
            </div>
            <Badge className="bg-primary text-white text-sm py-1">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-500">Total Users</p>
                    <p className="text-2xl font-bold">{analytics.totalUsers}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-500">Pending Loans</p>
                    <p className="text-2xl font-bold">{analytics.loanStats.pending}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-500">Approved Loans</p>
                    <p className="text-2xl font-bold">{analytics.loanStats.approved}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <CircleCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-500">Consultations</p>
                    <p className="text-2xl font-bold">{analytics.consultations.total}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="loans" className="space-y-6">
            <TabsList>
              <TabsTrigger value="loans">Loan Applications</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="auditLogs" onClick={() => window.location.href = "/audit-logs"}>
                Audit Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="loans">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>Loan Applications</CardTitle>
                    <div className="relative w-full md:w-[300px]">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-500" />
                      <Input
                        placeholder="Search applications..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoadingLoans || isLoadingUsers ? (
                    <div className="text-center py-8">Loading loan applications...</div>
                  ) : filteredLoans.length === 0 ? (
                    <div className="text-center py-8">
                      <FileSearch className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                      <h3 className="text-lg font-medium text-neutral-700">No loan applications found</h3>
                      {searchQuery && (
                        <p className="text-neutral-500">Try adjusting your search criteria</p>
                      )}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Loan Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Application Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLoans.map((loan) => {
                          const loanUser = getUserById(loan.userId);
                          return (
                            <TableRow key={loan.id}>
                              <TableCell className="font-medium">{loan.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center mr-2">
                                    <User className="h-4 w-4 text-neutral-500" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{loanUser?.fullName || 'Unknown'}</p>
                                    <p className="text-xs text-neutral-500">{loanUser?.email || '-'}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{loan.loanType}</TableCell>
                              <TableCell>{formatCurrency(Number(loan.amount))}</TableCell>
                              <TableCell>{formatDate(loan.appliedAt)}</TableCell>
                              <TableCell>
                                <Badge className={`${getStatusColor(loan.status).bg} ${getStatusColor(loan.status).text}`}>
                                  {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Open menu</span>
                                      <DollarSign className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onSelect={() => handleStatusChange(loan.id, 'approved')}
                                      disabled={loan.status === 'approved'}
                                    >
                                      <CheckIcon className="mr-2 h-4 w-4 text-green-600" />
                                      <span>Approve</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onSelect={() => handleStatusChange(loan.id, 'rejected')}
                                      disabled={loan.status === 'rejected'}
                                    >
                                      <XIcon className="mr-2 h-4 w-4 text-red-600" />
                                      <span>Reject</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <FileSearch className="mr-2 h-4 w-4" />
                                      <span>View Details</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage all users in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <div className="text-center py-8">Loading users...</div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                      <h3 className="text-lg font-medium text-neutral-700">No users found</h3>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined On</TableHead>
                          <TableHead>KYC Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell className="font-medium">{user.fullName}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge className={
                                user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                'bg-neutral-100 text-neutral-800'
                              }>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                Pending
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="consultations">
              <Card>
                <CardHeader>
                  <CardTitle>Consultations</CardTitle>
                  <CardDescription>Manage all scheduled and completed consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingConsultations || isLoadingUsers ? (
                    <div className="text-center py-8">Loading consultations...</div>
                  ) : consultations.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                      <h3 className="text-lg font-medium text-neutral-700">No consultations found</h3>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Topic</TableHead>
                          <TableHead>Preferred Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Booked On</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {consultations.map((consultation) => {
                          const consultationUser = getUserById(consultation.userId);
                          return (
                            <TableRow key={consultation.id}>
                              <TableCell>{consultation.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center mr-2">
                                    <User className="h-4 w-4 text-neutral-500" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{consultationUser?.fullName || 'Unknown'}</p>
                                    <p className="text-xs text-neutral-500">{consultationUser?.email || '-'}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{consultation.topic}</TableCell>
                              <TableCell>{formatDate(consultation.preferredDate)}</TableCell>
                              <TableCell>
                                <Badge className={`${getStatusColor(consultation.status).bg} ${getStatusColor(consultation.status).text}`}>
                                  {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(consultation.bookedAt)}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Open menu</span>
                                      <Calendar className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onSelect={() => handleConsultationStatusChange(consultation.id, 'scheduled')}
                                      disabled={consultation.status === 'scheduled'}
                                    >
                                      <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                                      <span>Mark as Scheduled</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onSelect={() => handleConsultationStatusChange(consultation.id, 'completed')}
                                      disabled={consultation.status === 'completed'}
                                    >
                                      <CheckIcon className="mr-2 h-4 w-4 text-green-600" />
                                      <span>Mark as Completed</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onSelect={() => handleConsultationStatusChange(consultation.id, 'cancelled')}
                                      disabled={consultation.status === 'cancelled'}
                                    >
                                      <XIcon className="mr-2 h-4 w-4 text-red-600" />
                                      <span>Cancel</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <FileSearch className="mr-2 h-4 w-4" />
                                      <span>View Details</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Approvals</CardTitle>
                    <CardDescription>Distribution of loan application statuses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="relative w-32 h-32 rounded-full flex items-center justify-center" style={{
                            background: `conic-gradient(#22c55e 0% ${(analytics.loanStats.approved / Math.max(analytics.loanStats.total, 1)) * 100}%, #f59e0b ${(analytics.loanStats.approved / Math.max(analytics.loanStats.total, 1)) * 100}% ${((analytics.loanStats.approved + analytics.loanStats.pending) / Math.max(analytics.loanStats.total, 1)) * 100}%, #ef4444 ${((analytics.loanStats.approved + analytics.loanStats.pending) / Math.max(analytics.loanStats.total, 1)) * 100}% 100%)`
                          }}>
                            <div className="absolute w-20 h-20 rounded-full bg-white flex items-center justify-center">
                              <PieChart className="h-8 w-8 text-neutral-400" />
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                              <span>Approved</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                              <span>Pending</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                              <span>Rejected</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-neutral-500">Total Applications</p>
                            <p className="text-2xl font-bold">{analytics.loanStats.total}</p>
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Approved</span>
                              <span className="text-sm font-medium text-green-600">
                                {analytics.loanStats.approved} 
                                <span className="text-neutral-500 ml-1">
                                  ({analytics.loanStats.total > 0 ? ((analytics.loanStats.approved / analytics.loanStats.total) * 100).toFixed(1) : 0}%)
                                </span>
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Pending</span>
                              <span className="text-sm font-medium text-yellow-600">
                                {analytics.loanStats.pending}
                                <span className="text-neutral-500 ml-1">
                                  ({analytics.loanStats.total > 0 ? ((analytics.loanStats.pending / analytics.loanStats.total) * 100).toFixed(1) : 0}%)
                                </span>
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Rejected</span>
                              <span className="text-sm font-medium text-red-600">
                                {analytics.loanStats.rejected}
                                <span className="text-neutral-500 ml-1">
                                  ({analytics.loanStats.total > 0 ? ((analytics.loanStats.rejected / analytics.loanStats.total) * 100).toFixed(1) : 0}%)
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>User Activity</CardTitle>
                    <CardDescription>Recent user registrations and activity trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-neutral-500">New Users (Last 7 days)</p>
                          <div className="flex items-center">
                            <p className="text-2xl font-bold mr-2">
                              {users.filter(u => 
                                new Date(u.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                              ).length}
                            </p>
                            <Badge className="bg-green-100 text-green-800">
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              10%
                            </Badge>
                          </div>
                        </div>
                        <div className="h-12 w-24 bg-neutral-100 rounded">
                          {/* Simple chart placeholder */}
                          <div className="h-full w-full flex items-end px-1 space-x-1">
                            <div className="w-2 bg-primary rounded-t" style={{ height: '30%' }}></div>
                            <div className="w-2 bg-primary rounded-t" style={{ height: '40%' }}></div>
                            <div className="w-2 bg-primary rounded-t" style={{ height: '20%' }}></div>
                            <div className="w-2 bg-primary rounded-t" style={{ height: '60%' }}></div>
                            <div className="w-2 bg-primary rounded-t" style={{ height: '40%' }}></div>
                            <div className="w-2 bg-primary rounded-t" style={{ height: '70%' }}></div>
                            <div className="w-2 bg-primary rounded-t" style={{ height: '80%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Recent Consultations</h4>
                        {consultations.slice(0, 3).map(consultation => {
                          const consultationUser = getUserById(consultation.userId);
                          return (
                            <div key={consultation.id} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center mr-2">
                                  <User className="h-4 w-4 text-neutral-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{consultationUser?.fullName || 'Unknown'}</p>
                                  <p className="text-xs text-neutral-500">{consultation.topic}</p>
                                </div>
                              </div>
                              <Badge className={`${getStatusColor(consultation.status).bg} ${getStatusColor(consultation.status).text}`}>
                                {consultation.status}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === 'approved' ? 'Approve Loan Application' : 'Reject Loan Application'}
            </DialogTitle>
            <DialogDescription>
              {newStatus === 'approved' 
                ? 'Are you sure you want to approve this loan application?' 
                : 'Please provide a reason for rejecting this loan application.'}
            </DialogDescription>
          </DialogHeader>
          
          {newStatus === 'rejected' && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Rejection Reason</Label>
                <Input
                  id="rejection-reason"
                  placeholder="Enter reason for rejection"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={statusMutation.isPending || (newStatus === 'rejected' && !rejectionReason)}
            >
              {statusMutation.isPending ? 'Updating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={consultationStatusDialogOpen} onOpenChange={setConsultationStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Update Consultation Status
            </DialogTitle>
            <DialogDescription>
              {newConsultationStatus === 'scheduled' && 'Mark this consultation as scheduled?'}
              {newConsultationStatus === 'completed' && 'Mark this consultation as completed?'}
              {newConsultationStatus === 'cancelled' && 'Are you sure you want to cancel this consultation?'}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConsultationStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConsultationStatusUpdate}
              disabled={consultationStatusMutation.isPending}
            >
              {consultationStatusMutation.isPending ? 'Updating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
