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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, Users, Settings, Lock, AlertTriangle, Activity, 
  Search, User, FileText, CheckCircle, XCircle, Edit, Key, AlertCircle, Info,
  ArrowRight
} from "lucide-react";
// import { User as UserType } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SuperAdminPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  
  // System settings state
  const [homeLoanRate, setHomeLoanRate] = useState(8.5);
  const [lapRate, setLapRate] = useState(9.5);
  const [btTopupRate, setBtTopupRate] = useState(8.0);
  const [enableNewRegistrations, setEnableNewRegistrations] = useState(true);
  const [enableAutoKYC, setEnableAutoKYC] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Fetch all users
  const { 
    data: users = [], 
    isLoading: isLoadingUsers 
  } = useQuery<UserType[]>({
    queryKey: ["/api/admin/users"],
  });

  // Fetch audit logs - in a real app, this would be fetched from the server
  const auditLogs = [
    { id: 1, userId: 1, action: 'User Login', details: 'Admin user logged in', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 2, userId: 1, action: 'Loan Status Update', details: 'Changed Loan #2 status to "approved"', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
    { id: 3, userId: 1, action: 'User Role Update', details: 'Changed user #3 role to "admin"', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
    { id: 4, userId: 1, action: 'System Settings Update', details: 'Updated interest rates', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
    { id: 5, userId: 2, action: 'Loan Status Update', details: 'Changed Loan #5 status to "rejected"', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  ];

  // Update user role mutation
  const roleMutation = useMutation({
    mutationFn: async (data: { id: number; role: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${data.id}/role`, { role: data.role });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setRoleDialogOpen(false);
    },
  });

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    return (
      user.fullName.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  // Handle role change
  const handleRoleChange = (id: number, currentRole: string) => {
    setSelectedUserId(id);
    setSelectedRole(currentRole);
    setRoleDialogOpen(true);
  };

  // Handle role update submission
  const handleRoleUpdate = () => {
    if (selectedUserId && selectedRole) {
      roleMutation.mutate({ id: selectedUserId, role: selectedRole });
    }
  };

  // Handle save settings
  const handleSaveSettings = () => {
    // In a real application, this would call an API to save the settings
    // For this demo, we'll just display an alert
    alert('Settings saved successfully!');
  };

  if (!user || user.role !== 'superadmin') {
    return (
      <div>
        <main className="flex items-center justify-center min-h-[80dvh]">
          <Alert className="max-w-md">
            <Shield className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access the super admin panel.
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
              <h1 className="text-3xl font-bold text-neutral-800">Super Admin Panel</h1>
              <p className="text-neutral-600">System settings, user roles, and audit logs</p>
            </div>
            <Badge className="bg-purple-600 text-white text-sm py-1">
              SuperAdmin
            </Badge>
          </div>

          {maintenanceMode && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Maintenance Mode Enabled</AlertTitle>
              <AlertDescription className="text-amber-700">
                The system is currently in maintenance mode. Regular users will see a maintenance message.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="user-roles" className="space-y-6">
            <TabsList>
              <TabsTrigger value="user-roles">User Roles</TabsTrigger>
              <TabsTrigger value="system-settings">System Settings</TabsTrigger>
              <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="user-roles">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>User Role Management</CardTitle>
                    <div className="relative w-full md:w-[300px]">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-500" />
                      <Input
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoadingUsers ? (
                    <div className="text-center py-8">Loading users...</div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                      <h3 className="text-lg font-medium text-neutral-700">No users found</h3>
                      {searchQuery && (
                        <p className="text-neutral-500">Try adjusting your search criteria</p>
                      )}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Current Role</TableHead>
                          <TableHead>Created On</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell>{u.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center mr-2">
                                  <User className="h-4 w-4 text-neutral-500" />
                                </div>
                                <span className="font-medium">{u.fullName}</span>
                              </div>
                            </TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.username}</TableCell>
                            <TableCell>
                              <Badge className={
                                u.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                                u.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                'bg-neutral-100 text-neutral-800'
                              }>
                                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(u.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRoleChange(u.id, u.role)}
                                disabled={u.id === user.id} // Can't change own role
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Change Role
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system-settings">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Settings</CardTitle>
                    <CardDescription>Configure interest rates and loan parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="home-loan-rate">Home Loan Interest Rate (%)</Label>
                      <div className="flex">
                        <Input
                          id="home-loan-rate"
                          type="number"
                          step="0.1"
                          min="5"
                          max="20"
                          value={homeLoanRate}
                          onChange={(e) => setHomeLoanRate(parseFloat(e.target.value))}
                        />
                        <span className="ml-2 flex items-center text-neutral-500">% p.a.</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lap-rate">Loan Against Property Interest Rate (%)</Label>
                      <div className="flex">
                        <Input
                          id="lap-rate"
                          type="number"
                          step="0.1"
                          min="5"
                          max="20"
                          value={lapRate}
                          onChange={(e) => setLapRate(parseFloat(e.target.value))}
                        />
                        <span className="ml-2 flex items-center text-neutral-500">% p.a.</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bt-topup-rate">Balance Transfer Top-Up Interest Rate (%)</Label>
                      <div className="flex">
                        <Input
                          id="bt-topup-rate"
                          type="number"
                          step="0.1"
                          min="5"
                          max="20"
                          value={btTopupRate}
                          onChange={(e) => setBtTopupRate(parseFloat(e.target.value))}
                        />
                        <span className="ml-2 flex items-center text-neutral-500">% p.a.</span>
                      </div>
                    </div>
                    
                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800">Interest Rate Changes</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        Changes to interest rates will only affect new loan applications and won't impact existing approved loans.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                    <CardDescription>Manage system-wide settings and features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new-registrations">Allow New Registrations</Label>
                        <p className="text-sm text-neutral-500">
                          Enable or disable user registration functionality
                        </p>
                      </div>
                      <Switch
                        id="new-registrations"
                        checked={enableNewRegistrations}
                        onCheckedChange={setEnableNewRegistrations}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-kyc">Automatic KYC Verification</Label>
                        <p className="text-sm text-neutral-500">
                          Automatically approve KYC documents on upload
                        </p>
                      </div>
                      <Switch
                        id="auto-kyc"
                        checked={enableAutoKYC}
                        onCheckedChange={setEnableAutoKYC}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="maintenance-mode" className="text-red-600 font-medium">Maintenance Mode</Label>
                        <p className="text-sm text-neutral-500">
                          Enable maintenance mode to temporarily block user access
                        </p>
                      </div>
                      <Switch
                        id="maintenance-mode"
                        checked={maintenanceMode}
                        onCheckedChange={setMaintenanceMode}
                      />
                    </div>
                    
                    {maintenanceMode && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                          Maintenance mode will prevent users from accessing the system. Only admins and super admins can log in.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button className="w-full" onClick={handleSaveSettings}>
                      Save Settings
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Configure system security and access control settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2 border p-4 rounded-lg">
                        <div className="flex items-center text-amber-800">
                          <Lock className="h-5 w-5 mr-2" />
                          <h3 className="font-medium">Session Timeout</h3>
                        </div>
                        <p className="text-sm text-neutral-600">Set inactivity timeout for user sessions</p>
                        <Select defaultValue="30">
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2 border p-4 rounded-lg">
                        <div className="flex items-center text-amber-800">
                          <Key className="h-5 w-5 mr-2" />
                          <h3 className="font-medium">Password Policy</h3>
                        </div>
                        <p className="text-sm text-neutral-600">Set minimum password requirements</p>
                        <Select defaultValue="strong">
                          <SelectTrigger>
                            <SelectValue placeholder="Select policy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic (6+ chars)</SelectItem>
                            <SelectItem value="medium">Medium (8+ chars, 1 number)</SelectItem>
                            <SelectItem value="strong">Strong (8+ chars, number, symbol)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2 border p-4 rounded-lg">
                        <div className="flex items-center text-amber-800">
                          <Activity className="h-5 w-5 mr-2" />
                          <h3 className="font-medium">Login Attempts</h3>
                        </div>
                        <p className="text-sm text-neutral-600">Maximum failed login attempts before lockout</p>
                        <Select defaultValue="5">
                          <SelectTrigger>
                            <SelectValue placeholder="Select attempts" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 attempts</SelectItem>
                            <SelectItem value="5">5 attempts</SelectItem>
                            <SelectItem value="10">10 attempts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audit-logs">
              <Card>
                <CardHeader>
                  <CardTitle>System Audit Logs</CardTitle>
                  <CardDescription>Track all system activities and user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="flex items-start border-b border-neutral-100 pb-4 last:border-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 mr-3">
                          {log.action.includes('Login') ? (
                            <User className="h-5 w-5 text-neutral-600" />
                          ) : log.action.includes('Loan') ? (
                            <FileText className="h-5 w-5 text-neutral-600" />
                          ) : log.action.includes('Role') ? (
                            <Shield className="h-5 w-5 text-neutral-600" />
                          ) : (
                            <Settings className="h-5 w-5 text-neutral-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-medium">{log.action}</h4>
                            <Badge className="ml-2 bg-neutral-100 text-neutral-800">
                              User #{log.userId}
                            </Badge>
                          </div>
                          <p className="text-sm text-neutral-600">{log.details}</p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {log.timestamp.toLocaleString('en-US', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Changing a user's role will modify their access permissions in the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedRole === 'superadmin' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Super Admin has full access to all system settings and can modify any data. Assign with caution.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRoleUpdate}
              disabled={roleMutation.isPending || !selectedRole}
              variant={selectedRole === 'superadmin' ? 'destructive' : 'default'}
            >
              {roleMutation.isPending ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
