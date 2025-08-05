import React from "react";
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
  AlertCircle, 
  FileText, 
  Calendar, 
  ChartPie, 
  CreditCard, 
  Wallet, 
  Clock, 
  CheckCircle,
  XCircle, 
  Upload
} from "lucide-react";
// import { LoanApplication, Consultation, SipInvestment, KycDocument, Transaction } from "@shared/schema";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();

  // Fetch loan applications
  const { 
    data: loanApplications = [], 
    isLoading: isLoadingLoans 
  } = useQuery<LoanApplication[]>({
    queryKey: ["/api/loan-applications"],
  });

  // Fetch consultations
  // const { 
  //   data: consultations = [], 
  //   isLoading: isLoadingConsultations 
  // } = useQuery<Consultation[]>({
  //   queryKey: ["/api/consultations"],
  // });

  // Fetch SIP investments
  // const { 
  //   data: sipInvestments = [], 
  //   isLoading: isLoadingSips 
  // } = useQuery<SipInvestment[]>({
  //   queryKey: ["/api/sip-investments"],
  // });

  // Fetch KYC documents
  // const { 
  //   data: kycDocuments = [], 
  //   isLoading: isLoadingKyc 
  // } = useQuery<KycDocument[]>({
  //   queryKey: ["/api/kyc-documents"],
  // });

  // Fetch transactions
  // const { 
  //   data: transactions = [], 
  //   isLoading: isLoadingTransactions 
  // } = useQuery<Transaction[]>({
  //   queryKey: ["/api/transactions"],
  // });

  // Check if KYC is complete
  const isKycComplete = kycDocuments.some(doc => doc.verificationStatus === "verified");
  
  // Get loan applications stats
  const totalLoans = loanApplications.length;
  const pendingLoans = loanApplications.filter(loan => loan.status === "pending").length;
  const approvedLoans = loanApplications.filter(loan => loan.status === "approved").length;
  const rejectedLoans = loanApplications.filter(loan => loan.status === "rejected").length;

  // Get next consultation if any
  const upcomingConsultation = consultations
    .filter(c => c.status === "scheduled")
    .sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime())[0];

  // Calculate total SIP value
  const totalSipValue = sipInvestments.reduce((sum, sip) => {
    const monthlyAmount = Number(sip.monthlyAmount);
    const duration = sip.durationMonths;
    const expectedReturn = Number(sip.expectedReturns) / 100;
    
    // Simple calculation (not compound interest formula for brevity)
    const principal = monthlyAmount * duration;
    const estimatedValue = principal * (1 + expectedReturn);
    
    return sum + estimatedValue;
  }, 0);

  return (
    <div>
      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-800">Dashboard</h1>
            <p className="text-neutral-600">Welcome back, {user?.fullName}</p>
          </div>

          {!isKycComplete && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Complete your KYC</AlertTitle>
              <AlertDescription className="text-amber-700">
                Your KYC verification is pending. Please upload your identity documents to unlock all features.
                <div className="mt-2">
                  <Link href="/dashboard?tab=kyc">
                    <Button variant="outline" size="sm" className="border-amber-500 text-amber-700">
                      Upload Documents
                    </Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-500">Total Loan Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-primary/10 p-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(loanApplications.reduce((sum, loan) => sum + Number(loan.amount), 0))}
                    </div>
                    <p className="text-xs text-neutral-500">
                      {approvedLoans} approved of {totalLoans} applications
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-500">SIP Investments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-primary/10 p-2">
                    <ChartPie className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(sipInvestments.reduce((sum, sip) => sum + Number(sip.monthlyAmount), 0))}
                      <span className="text-xs ml-1">/ month</span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Est. value: {formatCurrency(totalSipValue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-500">Next Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-primary/10 p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    {upcomingConsultation ? (
                      <>
                        <div className="text-base font-bold">
                          {formatDate(upcomingConsultation.preferredDate)}
                        </div>
                        <p className="text-xs text-neutral-500">
                          {upcomingConsultation.topic}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-base font-medium">No scheduled consultations</div>
                        <Link href="/consultation">
                          <Button size="sm" variant="link" className="h-auto p-0 text-primary">
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

          <Tabs defaultValue="loans">
            <TabsList className="mb-6">
              <TabsTrigger value="loans">Loan Applications</TabsTrigger>
              <TabsTrigger value="investments">SIP Investments</TabsTrigger>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="kyc">KYC Documents</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="loans">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-700">Pending</p>
                        <p className="text-xl font-bold text-blue-800">{pendingLoans}</p>
                      </div>
                    </div>
                    <Progress value={(pendingLoans / Math.max(totalLoans, 1)) * 100} className="w-16 bg-blue-200" indicatorClassName="bg-blue-600" />
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-green-700">Approved</p>
                        <p className="text-xl font-bold text-green-800">{approvedLoans}</p>
                      </div>
                    </div>
                    <Progress value={(approvedLoans / Math.max(totalLoans, 1)) * 100} className="w-16 bg-green-200" indicatorClassName="bg-green-600" />
                  </CardContent>
                </Card>
                
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-red-700">Rejected</p>
                        <p className="text-xl font-bold text-red-800">{rejectedLoans}</p>
                      </div>
                    </div>
                    <Progress value={(rejectedLoans / Math.max(totalLoans, 1)) * 100} className="w-16 bg-red-200" indicatorClassName="bg-red-600" />
                  </CardContent>
                </Card>
              </div>

              {isLoadingLoans ? (
                <div className="text-center py-8">Loading your loan applications...</div>
              ) : loanApplications.length === 0 ? (
                <Card className="bg-neutral-50 text-center p-8">
                  <FileText className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-700">No Loan Applications</h3>
                  <p className="text-neutral-500 mb-4">You haven't applied for any loans yet.</p>
                  <Link href="/loan-application?type=home-loan">
                    <Button>Apply for a Loan</Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {loanApplications.map((loan) => (
                    <Card key={loan.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-2/3 p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold">{loan.loanType}</h3>
                                <p className="text-sm text-neutral-500">Applied on {formatDate(loan.appliedAt)}</p>
                              </div>
                              <Badge className={`${getStatusColor(loan.status).bg} ${getStatusColor(loan.status).text}`}>
                                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                              </Badge>
                            </div>
                            {loan.purpose && (
                              <div className="mt-4">
                                <p className="text-sm font-medium text-neutral-700">Purpose</p>
                                <p className="text-sm text-neutral-600">{loan.purpose}</p>
                              </div>
                            )}
                            <div className="mt-4 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-neutral-700">Loan Amount</p>
                                <p className="text-base text-neutral-800">{formatCurrency(Number(loan.amount))}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-neutral-700">Interest Rate</p>
                                <p className="text-base text-neutral-800">{loan.interestRate}%</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-neutral-700">Tenure</p>
                                <p className="text-base text-neutral-800">{loan.tenure} months</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-neutral-700">Monthly EMI</p>
                                <p className="text-base text-neutral-800">
                                  {formatCurrency(
                                    (Number(loan.amount) * (Number(loan.interestRate) / 12 / 100) * 
                                    Math.pow(1 + Number(loan.interestRate) / 12 / 100, loan.tenure)) / 
                                    (Math.pow(1 + Number(loan.interestRate) / 12 / 100, loan.tenure) - 1)
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="md:w-1/3 bg-neutral-50 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-200">
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-neutral-700 mb-2">Application Status</h4>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                  <span className="text-sm text-neutral-600">Application submitted</span>
                                </div>
                                <div className="flex items-center">
                                  <div className={`h-2 w-2 rounded-full ${
                                    loan.status !== 'pending' ? 'bg-green-500' : 'bg-neutral-300'
                                  } mr-2`}></div>
                                  <span className={`text-sm ${
                                    loan.status !== 'pending' ? 'text-neutral-600' : 'text-neutral-400'
                                  }`}>Document verification</span>
                                </div>
                                <div className="flex items-center">
                                  <div className={`h-2 w-2 rounded-full ${
                                    loan.status === 'approved' ? 'bg-green-500' : (
                                      loan.status === 'rejected' ? 'bg-red-500' : 'bg-neutral-300'
                                    )
                                  } mr-2`}></div>
                                  <span className={`text-sm ${
                                    loan.status === 'pending' ? 'text-neutral-400' : 'text-neutral-600'
                                  }`}>
                                    {loan.status === 'approved' ? 'Approved' : (
                                      loan.status === 'rejected' ? 'Rejected' : 'Final approval'
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Button className="w-full" variant={
                                loan.status === 'approved' ? 'default' : 
                                loan.status === 'rejected' ? 'destructive' : 'outline'
                              }>
                                {loan.status === 'approved' ? 'View Details' : 
                                  loan.status === 'rejected' ? 'See Rejection Reason' : 'Check Status'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {loanApplications.length > 0 && (
                <div className="mt-6 text-center">
                  <Link href="/loan-application?type=home-loan">
                    <Button>Apply for Another Loan</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="investments">
              {isLoadingSips ? (
                <div className="text-center py-8">Loading your SIP investments...</div>
              ) : sipInvestments.length === 0 ? (
                <Card className="bg-neutral-50 text-center p-8">
                  <ChartPie className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-700">No Active SIP Investments</h3>
                  <p className="text-neutral-500 mb-4">Start your wealth creation journey with regular SIP investments.</p>
                  <Link href="/sip">
                    <Button>Start SIP Now</Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {sipInvestments.map((sip) => (
                    <Card key={sip.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{sip.planName}</h3>
                            <p className="text-sm text-neutral-500">Started on {formatDate(sip.startDate)}</p>
                          </div>
                          <Badge className={`${
                            sip.status === 'active' ? 'bg-green-100 text-green-800' : 
                            sip.status === 'paused' ? 'bg-amber-100 text-amber-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {sip.status.charAt(0).toUpperCase() + sip.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-700">Monthly Amount</p>
                            <p className="text-base text-neutral-800">{formatCurrency(Number(sip.monthlyAmount))}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-700">Duration</p>
                            <p className="text-base text-neutral-800">{sip.durationMonths} months</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-700">Expected Returns</p>
                            <p className="text-base text-neutral-800">{sip.expectedReturns}% p.a.</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-700">Total Investment</p>
                            <p className="text-base text-neutral-800">{formatCurrency(Number(sip.monthlyAmount) * sip.durationMonths)}</p>
                          </div>
                        </div>

                        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-neutral-700">Investment Progress</span>
                            <span className="text-sm text-neutral-600">
                              {Math.min(12, sip.durationMonths)} of {sip.durationMonths} months
                            </span>
                          </div>
                          <Progress value={(Math.min(12, sip.durationMonths) / sip.durationMonths) * 100} className="mb-4" />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-neutral-500">Current Value</p>
                              <p className="text-lg font-semibold text-primary">
                                {formatCurrency(Number(sip.monthlyAmount) * Math.min(12, sip.durationMonths) * (1 + Number(sip.expectedReturns) / 100 / 12))}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-neutral-500">Projected Value</p>
                              <p className="text-lg font-semibold text-primary">
                                {formatCurrency(
                                  Number(sip.monthlyAmount) * sip.durationMonths * (1 + Number(sip.expectedReturns) / 100)
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {sipInvestments.length > 0 && (
                <div className="mt-6 text-center">
                  <Link href="/sip">
                    <Button>Start Another SIP</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="consultations">
              {isLoadingConsultations ? (
                <div className="text-center py-8">Loading your consultations...</div>
              ) : consultations.length === 0 ? (
                <Card className="bg-neutral-50 text-center p-8">
                  <Calendar className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-700">No Consultations Booked</h3>
                  <p className="text-neutral-500 mb-4">Book your free financial consultation with our experts.</p>
                  <Link href="/consultation">
                    <Button>Book Consultation</Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {consultations.map((consultation) => (
                    <Card key={consultation.id}>
                      <CardContent className="flex flex-col md:flex-row justify-between p-6">
                        <div>
                          <div className="flex items-center mb-2">
                            <Badge className={`mr-2 ${getStatusColor(consultation.status).bg} ${getStatusColor(consultation.status).text}`}>
                              {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                            </Badge>
                            <h3 className="text-lg font-semibold">{consultation.topic}</h3>
                          </div>
                          <p className="text-sm text-neutral-500">Booked on {formatDate(consultation.bookedAt)}</p>
                          
                          <div className="mt-4">
                            <p className="text-sm font-medium text-neutral-700">Preferred Date</p>
                            <p className="text-base text-neutral-800">{formatDate(consultation.preferredDate)}</p>
                          </div>
                          
                          {consultation.notes && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-neutral-700">Notes</p>
                              <p className="text-sm text-neutral-600">{consultation.notes}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col md:items-end justify-between">
                          {consultation.status === 'scheduled' && (
                            <div className="flex items-center text-sm text-neutral-600 mb-4">
                              <Clock className="mr-2 h-4 w-4 text-neutral-500" />
                              <span>{
                                new Date(consultation.preferredDate).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })
                              }</span>
                            </div>
                          )}
                          
                          <Button variant={
                            consultation.status === 'scheduled' ? 'default' : 
                            consultation.status === 'completed' ? 'outline' : 
                            'secondary'
                          }>
                            {consultation.status === 'scheduled' ? 'Reschedule' : 
                             consultation.status === 'completed' ? 'View Summary' : 
                             'Book Again'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="mt-6 text-center">
                <Link href="/consultation">
                  <Button>Book New Consultation</Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="kyc">
              <Card>
                <CardHeader>
                  <CardTitle>KYC Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingKyc ? (
                    <div className="text-center py-8">Loading your KYC documents...</div>
                  ) : kycDocuments.length === 0 ? (
                    <div className="text-center py-6">
                      <Upload className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                      <h3 className="text-lg font-medium text-neutral-700 mb-2">No KYC Documents Uploaded</h3>
                      <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                        Please upload your identification documents to complete KYC verification and unlock all features.
                      </p>
                      
                      <div className="space-y-4">
                        <Card className="border-dashed">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-6 w-6 text-neutral-400 mr-3" />
                              <div>
                                <p className="font-medium">PAN Card</p>
                                <p className="text-sm text-neutral-500">Upload your PAN card for identity verification</p>
                              </div>
                            </div>
                            <Button variant="outline">Upload</Button>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-dashed">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-6 w-6 text-neutral-400 mr-3" />
                              <div>
                                <p className="font-medium">Aadhaar Card</p>
                                <p className="text-sm text-neutral-500">Upload your Aadhaar card for address verification</p>
                              </div>
                            </div>
                            <Button variant="outline">Upload</Button>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-dashed">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-6 w-6 text-neutral-400 mr-3" />
                              <div>
                                <p className="font-medium">Salary Slip</p>
                                <p className="text-sm text-neutral-500">Upload your last 3 months salary slips for income verification</p>
                              </div>
                            </div>
                            <Button variant="outline">Upload</Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {kycDocuments.map((doc) => (
                        <Card key={doc.id}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-6 w-6 text-neutral-400 mr-3" />
                              <div>
                                <p className="font-medium">{doc.documentType}</p>
                                <p className="text-sm text-neutral-500">Uploaded on {formatDate(doc.uploadedAt)}</p>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(doc.verificationStatus).bg} ${getStatusColor(doc.verificationStatus).text}`}>
                              {doc.verificationStatus.charAt(0).toUpperCase() + doc.verificationStatus.slice(1)}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {kycDocuments.length < 3 && (
                        <Button className="mt-4">Upload More Documents</Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingTransactions ? (
                    <div className="text-center py-8">Loading your transactions...</div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-6">
                      <Wallet className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                      <h3 className="text-lg font-medium text-neutral-700">No Transactions Yet</h3>
                      <p className="text-neutral-500">Your transaction history will appear here once you start using our services.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.transactionType === 'loan_disbursement' ? 'bg-green-100' :
                              transaction.transactionType === 'emi_payment' ? 'bg-blue-100' : 'bg-purple-100'
                            }`}>
                              {transaction.transactionType === 'loan_disbursement' ? (
                                <CreditCard className="h-5 w-5 text-green-600" />
                              ) : transaction.transactionType === 'emi_payment' ? (
                                <Clock className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Wallet className="h-5 w-5 text-purple-600" />
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{
                                transaction.transactionType === 'loan_disbursement' ? 'Loan Disbursement' :
                                transaction.transactionType === 'emi_payment' ? 'EMI Payment' : 'SIP Contribution'
                              }</p>
                              <p className="text-sm text-neutral-500">{formatDate(transaction.transactionDate)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.transactionType === 'loan_disbursement' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {transaction.transactionType === 'loan_disbursement' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                            </p>
                            {transaction.description && (
                              <p className="text-xs text-neutral-500">{transaction.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <ChatbotButton />
    </div>
  );
}
