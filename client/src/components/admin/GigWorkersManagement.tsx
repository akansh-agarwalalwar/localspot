import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  Star,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Calendar,
  Badge,
  Filter,
  Search,
  Download,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { gigWorkerAPI } from "@/services/api";

interface GigWorker {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  year: string;
  branch: string;
  skills: string[];
  experience: string;
  hourlyRate: string;
  status: string;
  rating: number;
  completedProjects: number;
  totalEarnings: number;
  isAvailable: boolean;
  joinedAt: string;
  lastActive: string;
}

interface GigWorkerStats {
  totalWorkers: number;
  pendingWorkers: number;
  activeWorkers: number;
  inactiveWorkers: number;
  averageRating: number;
  skillDistribution: Array<{ _id: string; count: number }>;
}

const GigWorkersManagement = () => {
  const [workers, setWorkers] = useState<GigWorker[]>([]);
  const [stats, setStats] = useState<GigWorkerStats | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<GigWorker | null>(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    skills: '',
    experience: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const skillLabels: Record<string, string> = {
    assignments: 'Assignment Writing',
    excel: 'Excel Sheets',
    documents: 'Document Creation',
    coding: 'Programming/Coding',
    design: 'Graphic Design',
    research: 'Research Work'
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: 10,
        ...filters
      };
      
      const response = await gigWorkerAPI.getAllGigWorkers(params);
      
      if (response.data.success) {
        setWorkers(response.data.data.workers);
        setPagination(response.data.data.pagination);
      }
    } catch (error: any) {
      console.error('Error fetching workers:', error);
      toast.error("Failed to fetch gig workers");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await gigWorkerAPI.getGigWorkerStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast.error("Failed to fetch statistics");
    }
  };

  useEffect(() => {
    fetchWorkers();
    fetchStats();
  }, [filters, pagination.current]);

  const handleStatusUpdate = async (workerId: string, newStatus: string) => {
    try {
      setActionLoading(workerId);
      
      const response = await gigWorkerAPI.updateGigWorkerStatus(workerId, newStatus);
      
      if (response.data.success) {
        toast.success(`Worker status updated to ${newStatus}`);
        fetchWorkers();
        fetchStats();
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error("Failed to update worker status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewWorker = async (workerId: string) => {
    try {
      const response = await gigWorkerAPI.getGigWorkerById(workerId);
      if (response.data.success) {
        setSelectedWorker(response.data.data);
        setShowWorkerModal(true);
      }
    } catch (error: any) {
      console.error('Error fetching worker details:', error);
      toast.error("Failed to fetch worker details");
    }
  };

  const handleDeleteWorker = async (workerId: string) => {
    if (!confirm('Are you sure you want to delete this worker?')) return;
    
    try {
      setActionLoading(workerId);
      
      const response = await gigWorkerAPI.deleteGigWorker(workerId);
      
      if (response.data.success) {
        toast.success("Worker deleted successfully");
        fetchWorkers();
        fetchStats();
      }
    } catch (error: any) {
      console.error('Error deleting worker:', error);
      toast.error("Failed to delete worker");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSkillBadges = (skills: string[]) => {
    return skills.map(skill => (
      <UIBadge key={skill} variant="secondary" className="mr-1 mb-1">
        {skillLabels[skill] || skill}
      </UIBadge>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-purple-600" />
            GIG Workers Management
          </h2>
          <p className="text-gray-600 mt-1">Manage freelance workers and their registrations</p>
        </div>
        <Button onClick={() => { fetchWorkers(); fetchStats(); }} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Workers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalWorkers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingWorkers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeWorkers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inactiveWorkers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Experience</Label>
              <Select value={filters.experience} onValueChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Skills</Label>
              <Select value={filters.skills} onValueChange={(value) => setFilters(prev => ({ ...prev, skills: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All skills</SelectItem>
                  <SelectItem value="assignments">Assignment Writing</SelectItem>
                  <SelectItem value="excel">Excel Sheets</SelectItem>
                  <SelectItem value="documents">Document Creation</SelectItem>
                  <SelectItem value="coding">Programming/Coding</SelectItem>
                  <SelectItem value="design">Graphic Design</SelectItem>
                  <SelectItem value="research">Research Work</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workers Table */}
      <Card>
        <CardHeader>
          <CardTitle>GIG Workers ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No workers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Worker</th>
                    <th className="text-left p-2">Academic Info</th>
                    <th className="text-left p-2">Skills</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Rating</th>
                    <th className="text-left p-2">Joined</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{worker.fullName}</div>
                          <div className="text-gray-500 text-xs flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {worker.email}
                          </div>
                          <div className="text-gray-500 text-xs flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {worker.mobile}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs">
                          <div className="flex items-center gap-1 mb-1">
                            <GraduationCap className="h-3 w-3" />
                            {worker.year}
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {worker.branch}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {worker.skills.slice(0, 2).map(skill => (
                            <UIBadge key={skill} variant="secondary" className="text-xs">
                              {skillLabels[skill] || skill}
                            </UIBadge>
                          ))}
                          {worker.skills.length > 2 && (
                            <UIBadge variant="outline" className="text-xs">
                              +{worker.skills.length - 2}
                            </UIBadge>
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <UIBadge className={statusColors[worker.status]}>
                          {worker.status}
                        </UIBadge>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          {worker.rating.toFixed(1)}
                        </div>
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        {formatDate(worker.joinedAt)}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewWorker(worker._id)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          
                          {worker.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(worker._id, 'active')}
                                disabled={actionLoading === worker._id}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(worker._id, 'rejected')}
                                disabled={actionLoading === worker._id}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Worker Details Modal */}
      <Dialog open={showWorkerModal} onOpenChange={setShowWorkerModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Worker Details</DialogTitle>
            <DialogDescription>
              Complete information about the gig worker
            </DialogDescription>
          </DialogHeader>
          
          {selectedWorker && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <p className="font-medium">{selectedWorker.fullName}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <UIBadge className={statusColors[selectedWorker.status]}>
                    {selectedWorker.status}
                  </UIBadge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedWorker.email}</p>
                </div>
                <div>
                  <Label>Mobile</Label>
                  <p className="text-sm">{selectedWorker.mobile}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Academic Year</Label>
                  <p className="text-sm">{selectedWorker.year}</p>
                </div>
                <div>
                  <Label>Branch</Label>
                  <p className="text-sm">{selectedWorker.branch}</p>
                </div>
              </div>

              <div>
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {getSkillBadges(selectedWorker.skills)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Experience</Label>
                  <p className="text-sm capitalize">{selectedWorker.experience}</p>
                </div>
                <div>
                  <Label>Hourly Rate</Label>
                  <p className="text-sm">₹{selectedWorker.hourlyRate}</p>
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{selectedWorker.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Joined Date</Label>
                  <p className="text-sm">{formatDate(selectedWorker.joinedAt)}</p>
                </div>
                <div>
                  <Label>Last Active</Label>
                  <p className="text-sm">{formatDate(selectedWorker.lastActive)}</p>
                </div>
              </div>

              {selectedWorker.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedWorker._id, 'active');
                      setShowWorkerModal(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedWorker._id, 'rejected');
                      setShowWorkerModal(false);
                    }}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GigWorkersManagement;
