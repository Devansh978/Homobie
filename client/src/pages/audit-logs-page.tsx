import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { Loader2, Filter, UserCheck, FileText, Clock, Search, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { AuditLog } from "@shared/schema";

export default function AuditLogsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("");
  const [actionTypeFilter, setActionTypeFilter] = useState<string>("");
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const pageSize = 10;

  // Fetch audit logs
  const { data, isLoading, refetch } = useQuery<{
    logs: AuditLog[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }>({
    queryKey: ["/api/audit-logs", { limit: 100, offset: 0 }],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.logs) {
      let filtered = [...data.logs];
      
      // Apply search filter
      if (searchTerm) {
        const lowerCaseSearch = searchTerm.toLowerCase();
        filtered = filtered.filter(log => 
          log.description.toLowerCase().includes(lowerCaseSearch) ||
          log.actionType.toLowerCase().includes(lowerCaseSearch) ||
          log.entityType?.toLowerCase().includes(lowerCaseSearch) ||
          String(log.entityId).includes(lowerCaseSearch) ||
          String(log.userId).includes(lowerCaseSearch)
        );
      }
      
      // Apply entity type filter
      if (entityTypeFilter) {
        filtered = filtered.filter(log => log.entityType === entityTypeFilter);
      }
      
      // Apply action type filter
      if (actionTypeFilter) {
        filtered = filtered.filter(log => log.actionType === actionTypeFilter);
      }
      
      setFilteredLogs(filtered);
    }
  }, [data, searchTerm, entityTypeFilter, actionTypeFilter]);

  // Get unique entity types and action types for filters
  const entityTypes = data?.logs 
    ? Array.from(new Set(data.logs.map(log => log.entityType).filter(Boolean) as string[])) 
    : [];
    
  const actionTypes = data?.logs 
    ? Array.from(new Set(data.logs.map(log => log.actionType))) 
    : [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Helper function to format JSON for display
  const formatJsonValue = (value: any): React.ReactNode => {
    if (!value) return "N/A";
    if (typeof value === "object") {
      return (
        <pre className="text-xs overflow-x-auto bg-gray-100 dark:bg-gray-800 p-2 rounded max-h-24">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    return String(value);
  };

  // Helper function to get action type color
  const getActionTypeColor = (actionType: string) => {
    if (actionType.includes("create")) return "bg-green-100 text-green-800";
    if (actionType.includes("update")) return "bg-blue-100 text-blue-800";
    if (actionType.includes("delete")) return "bg-red-100 text-red-800";
    if (actionType.includes("view")) return "bg-gray-100 text-gray-800";
    if (actionType.includes("login")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p className="mt-2">You don't have permission to view this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>System Audit Logs</CardTitle>
              <CardDescription>Track all system activities and user actions</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                refetch();
                toast({
                  title: "Refreshed",
                  description: "Audit logs have been refreshed",
                });
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search logs by description, action, entity..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-1/2">
              <div className="flex-1">
                <Select
                  value={entityTypeFilter}
                  onValueChange={setEntityTypeFilter}
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Entity Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Entities</SelectItem>
                    {entityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select
                  value={actionTypeFilter}
                  onValueChange={setActionTypeFilter}
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Action Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Actions</SelectItem>
                    {actionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : paginatedLogs.length > 0 ? (
            <div className="space-y-4">
              {paginatedLogs.map((log) => (
                <Card key={log.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between flex-wrap gap-2 mb-2">
                      <div className="flex items-center">
                        <Badge variant="outline" className={getActionTypeColor(log.actionType)}>
                          {log.actionType.replace(/_/g, " ")}
                        </Badge>
                        {log.entityType && (
                          <Badge variant="outline" className="ml-2">
                            {log.entityType}
                            {log.entityId && ` #${log.entityId}`}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <UserCheck className="h-4 w-4 mr-1" />
                        <span>User #{log.userId}</span>
                        <Clock className="h-4 w-4 ml-4 mr-1" />
                        <span>{formatDate(log.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{log.description}</p>
                    
                    {(log.oldValue || log.newValue) && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                        {log.oldValue && (
                          <div>
                            <div className="font-medium mb-1">Previous State:</div>
                            {formatJsonValue(log.oldValue)}
                          </div>
                        )}
                        {log.newValue && (
                          <div>
                            <div className="font-medium mb-1">New State:</div>
                            {formatJsonValue(log.newValue)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">No audit logs found matching your criteria.</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
}