import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Users, 
  Package, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  BarChart3,
  Settings,
  Filter,
  Download,
  Search,
  Building,
  Heart,
  Shield
} from 'lucide-react';
import { mockDonations, mockRequests, mockUsers, mockAnalytics } from '../../mock';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalUsers: mockUsers.length,
    totalDonations: mockDonations.length,
    totalRequests: mockRequests.length,
    pendingApprovals: mockDonations.filter(d => d.status === 'pending').length + 
                      mockRequests.filter(r => r.status === 'pending').length,
    successfulMatches: mockAnalytics.successfulMatches,
    activeUsers: mockAnalytics.activeUsers
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'donor': return 'bg-green-100 text-green-800 border-green-200';
      case 'recipient': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback className="text-xl">{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Platform Overview & Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Donations</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalDonations}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="text-green-600">+8%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Successful Matches</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.successfulMatches}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="text-green-600">+15%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Requires immediate attention
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Donations Requiring Approval */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-green-600" />
                    <span>Pending Donations</span>
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDonations.filter(d => d.status === 'pending').slice(0, 3).map((donation) => (
                      <div key={donation.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <img 
                          src={donation.images[0]} 
                          alt={donation.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{donation.title}</h4>
                          <p className="text-sm text-gray-600">by {donation.donorName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(donation.status)}>
                              {donation.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{donation.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Requests */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <span>Pending Requests</span>
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRequests.filter(r => r.status === 'pending').map((request) => (
                      <div key={request.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{request.organization}</h4>
                          <p className="text-sm text-gray-600">
                            Requesting {request.requestedQuantity} items from "{request.donationTitle}"
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                            <Badge className={`text-xs ${request.urgencyLevel === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {request.urgencyLevel} priority
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span>System Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Platform Utilization</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    <p className="text-xs text-green-600 mt-1">Healthy</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>AI System Performance</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                    <p className="text-xs text-green-600 mt-1">Excellent</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>User Satisfaction</span>
                      <span>91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                    <p className="text-xs text-green-600 mt-1">Very Good</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Donations</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                      <img 
                        src={donation.images[0]} 
                        alt={donation.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{donation.title}</h4>
                        <p className="text-sm text-gray-600">
                          by {donation.donorName} • {donation.quantity} items • {donation.category}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getStatusColor(donation.status)}>
                            {donation.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{donation.createdAt}</span>
                          {donation.aiAnalysis && (
                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                              AI: {Math.round(donation.aiAnalysis.categoryConfidence * 100)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {donation.status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search Users
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((userData) => (
                    <div key={userData.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={userData.profilePicture} alt={userData.name} />
                        <AvatarFallback>{userData.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                          <span>{userData.name}</span>
                          {userData.role === 'recipient' && userData.organization && (
                            <Shield className="h-4 w-4 text-green-600" />
                          )}
                        </h4>
                        <p className="text-sm text-gray-600">{userData.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRoleColor(userData.role)}>
                            {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Joined {userData.joinDate}
                          </span>
                          {userData.organization && (
                            <span className="text-xs text-gray-500">
                              • {userData.organization}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right text-sm">
                          {userData.role === 'donor' && (
                            <div className="text-gray-600">
                              {userData.donationsCount || 0} donations
                            </div>
                          )}
                          {userData.role === 'recipient' && (
                            <div className="text-gray-600">
                              {userData.receivedCount || 0} received
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.monthlyStats.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month.month}</span>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600">{month.donations} donations</span>
                          <span className="text-blue-600">{month.requests} requests</span>
                          <span className="text-purple-600">{month.matches} matches</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Items Saved from Waste</span>
                      <span className="text-lg font-bold text-green-600">
                        {mockAnalytics.impactMetrics.clothingItemsSaved}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CO₂ Reduced</span>
                      <span className="text-lg font-bold text-blue-600">
                        {mockAnalytics.impactMetrics.co2Reduced}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Families Helped</span>
                      <span className="text-lg font-bold text-purple-600">
                        {mockAnalytics.impactMetrics.familiesHelped}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Partner Organizations</span>
                      <span className="text-lg font-bold text-orange-600">
                        {mockAnalytics.impactMetrics.partneredOrganizations}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Donation Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalytics.categoryDistribution.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{category.value} items</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              backgroundColor: category.color,
                              width: `${(category.value / Math.max(...mockAnalytics.categoryDistribution.map(c => c.value))) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;