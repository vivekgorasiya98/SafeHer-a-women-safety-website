"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, AlertTriangle, TrendingUp, Shield, MapPin, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import { DashboardLayout } from "./dashboard-layout"
import { SafetyMap } from "@/components/maps/safety-map"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "volunteer"
  status: "active" | "pending" | "suspended"
  joinDate: string
}

interface Alert {
  id: string
  type: "sos" | "incident"
  location: string
  timestamp: string
  status: "active" | "resolved"
  priority: "high" | "medium" | "low"
}

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Mike Volunteer",
      email: "mike@example.com",
      role: "volunteer",
      status: "pending",
      joinDate: "2024-01-20",
    },
    {
      id: "3",
      name: "Emma Safety",
      email: "emma@example.com",
      role: "volunteer",
      status: "active",
      joinDate: "2024-01-10",
    },
  ])

  const [alerts, setAlerts] = useState<Alert[]>([
    { id: "1", type: "sos", location: "Downtown Plaza", timestamp: "5 min ago", status: "active", priority: "high" },
    {
      id: "2",
      type: "incident",
      location: "Park Avenue",
      timestamp: "1 hour ago",
      status: "resolved",
      priority: "medium",
    },
  ])

  const { toast } = useToast()

  const handleUserAction = (userId: string, action: "approve" | "suspend" | "activate") => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: action === "approve" ? "active" : action === "suspend" ? "suspended" : "active" }
          : user,
      ),
    )
    toast({
      title: "User Updated",
      description: `User has been ${action}d successfully`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Admin Dashboard</h1>
            <p className="text-navy-600">Monitor and manage the SafeGuard platform</p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-purple-500" />
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">System Administrator</Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-turquoise-200 bg-turquoise-50/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-turquoise-700">Total Users</CardTitle>
              <Users className="h-4 w-4 text-turquoise-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-turquoise-600">1,247</div>
              <p className="text-xs text-turquoise-500">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {alerts.filter((a) => a.status === "active").length}
              </div>
              <p className="text-xs text-red-500">Requiring attention</p>
            </CardContent>
          </Card>

          <Card className="border-teal-200 bg-teal-50/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Volunteers</CardTitle>
              <Shield className="h-4 w-4 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">89</div>
              <p className="text-xs text-teal-500">Verified helpers</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <p className="text-xs text-purple-500">Average this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="alerts">Alert Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Map */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>System Overview Map</CardTitle>
                  <CardDescription>Real-time view of all platform activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <SafetyMap userRole="admin" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent System Activity</CardTitle>
                  <CardDescription>Latest platform events and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New SOS alert in Downtown</p>
                        <p className="text-xs text-gray-500">5 minutes ago</p>
                      </div>
                      <Badge variant="destructive">High Priority</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Volunteer verified: Mike V.</p>
                        <p className="text-xs text-gray-500">15 minutes ago</p>
                      </div>
                      <Badge variant="secondary">Approved</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registration</p>
                        <p className="text-xs text-gray-500">30 minutes ago</p>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users and volunteer verifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <Badge variant="outline">{user.role}</Badge>
                        {getStatusBadge(user.status)}
                      </div>
                      <div className="flex space-x-2">
                        {user.status === "pending" && (
                          <Button size="sm" onClick={() => handleUserAction(user.id, "approve")}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        {user.status === "active" && (
                          <Button size="sm" variant="destructive" onClick={() => handleUserAction(user.id, "suspend")}>
                            <XCircle className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Monitoring</CardTitle>
                <CardDescription>Monitor and manage all safety alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <AlertTriangle className={`h-5 w-5 ${getPriorityColor(alert.priority)}`} />
                        <div>
                          <p className="font-medium capitalize">{alert.type} Alert</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>{alert.location}</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>
                        <Badge variant={alert.status === "active" ? "destructive" : "secondary"}>{alert.status}</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        {alert.status === "active" && <Button size="sm">Escalate</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                  <CardDescription>Key metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Active Users</span>
                      <span className="font-bold">342</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">SOS Alerts (24h)</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Response Time (avg)</span>
                      <span className="font-bold">3.2 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Resolution Rate</span>
                      <span className="font-bold">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Safety Zones</CardTitle>
                  <CardDescription>High-risk area analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Downtown Plaza</span>
                      <Badge variant="destructive">High Risk</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Central Park</span>
                      <Badge variant="secondary">Medium Risk</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">University District</span>
                      <Badge variant="default">Low Risk</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Shopping Mall</span>
                      <Badge variant="default">Safe Zone</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
