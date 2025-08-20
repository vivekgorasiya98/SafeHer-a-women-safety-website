"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, MapPin, Clock, Users, Phone, Search } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SafetyMap } from "@/components/maps/safety-map"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"

interface SOSAlert {
  id: string
  user_name: string
  latitude: number
  longitude: number
  address: string
  message: string
  status: "active" | "responded" | "resolved"
  priority: "high" | "medium" | "low"
  created_at: string
  responders: string[]
}

export default function SOSMonitorPage() {
  const [alerts, setAlerts] = useState<SOSAlert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<SOSAlert[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load SOS alerts from API
    const loadAlerts = async () => {
      try {
        const response = await apiClient.getSOSAlerts()
        setAlerts(response.data?.alerts || [])
        setFilteredAlerts(response.data?.alerts || [])

      } catch (error) {
        console.error("Failed to load SOS alerts:", error)
        toast({
          title: "Load Error",
          description: "Failed to load SOS alerts. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadAlerts()

    // Set up long polling for real-time updates
    const pollInterval = setInterval(async () => {
      try {
        const response = await apiClient.getSOSAlerts(); // ✅ await the promise
        if (response.success && response.data && Array.isArray(response.data.alerts)) {
          setAlerts(response.data.alerts);
          setFilteredAlerts(response.data.alerts);
        } else {
          console.error("Unexpected response structure:", response);
        }

      } catch (error) {
        console.error("Polling error:", error)
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(pollInterval)
  }, [toast])

  useEffect(() => {
    // Filter alerts based on search and status
    let filtered = alerts

    if (searchQuery) {
      filtered = filtered.filter(
        (alert) =>
          alert.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alert.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alert.message.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((alert) => alert.status === statusFilter)
    }

    setFilteredAlerts(filtered)
  }, [alerts, searchQuery, statusFilter])

  const handleRespondToAlert = async (alertId: string) => {
    try {
      await apiClient.respondToSOSAlert(alertId); // ✅ no TypeScript error
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === alertId ? { ...alert, status: "responded" as const } : alert)),
      )
      toast({
        title: "Response Sent",
        description: "You're now responding to this emergency alert.",
        className: "border-teal-200 bg-teal-50 text-teal-800",
      })
    } catch (error) {
      toast({
        title: "Response Failed",
        description: "Failed to respond to alert. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleResolveAlert = async (alertId: string) => {
    try {
      await apiClient.resolveSOSAlert(alertId)
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" as const } : alert)),
      )
      toast({
        title: "Alert Resolved",
        description: "Thank you for helping keep our community safe!",
        className: "border-green-200 bg-green-50 text-green-800",
      })
    } catch (error) {
      toast({
        title: "Resolution Failed",
        description: "Failed to resolve alert. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCallUser = (alert: SOSAlert) => {
    toast({
      title: "Calling User",
      description: `Attempting to contact ${alert.user_name}...`,
      className: "border-purple-200 bg-purple-50 text-purple-800",
    })
    // In a real app, this would initiate a call
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>
      case "responded":
        return <Badge className="bg-yellow-100 text-yellow-700">Responding</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-700">Resolved</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-navy-600">Loading SOS alerts...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">SOS Monitor</h1>
            <p className="text-navy-600">Real-time emergency alert monitoring and response</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <Badge className="bg-green-100 text-green-700">Live Monitoring</Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-red-200 bg-red-50/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {alerts.filter((a) => a.status === "active").length}
              </div>
              <p className="text-xs text-red-500">Requiring immediate response</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Responding</CardTitle>
              <Users className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {alerts.filter((a) => a.status === "responded").length}
              </div>
              <p className="text-xs text-yellow-500">Currently being handled</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Resolved Today</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {alerts.filter((a) => a.status === "resolved").length}
              </div>
              <p className="text-xs text-green-500">Successfully handled</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">2.3m</div>
              <p className="text-xs text-purple-500">Average response time</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-navy-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search alerts by name, location, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "active" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("active")}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === "responded" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("responded")}
                >
                  Responding
                </Button>
                <Button
                  variant={statusFilter === "resolved" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("resolved")}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Resolved
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Alert List</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No alerts found matching your criteria.</p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${getPriorityColor(alert.priority)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-navy-900">{alert.user_name}</h3>
                            {getStatusBadge(alert.status)}
                            <Badge variant="outline" className="capitalize">
                              {alert.priority} Priority
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">{getTimeAgo(alert.created_at)}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{alert.address || `${alert.latitude}, ${alert.longitude}`}</span>
                        </div>

                        {alert.message && (
                          <p className="text-sm text-navy-700 bg-gray-50 p-3 rounded-lg">{alert.message}</p>
                        )}

                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{alert.responders.length} volunteer(s) responding</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        {alert.status === "active" && (
                          <Button size="sm" onClick={() => handleRespondToAlert(alert.id)}>
                            Respond
                          </Button>
                        )}
                        {alert.status === "responded" && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            Mark Resolved
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleCallUser(alert)}>
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Live Alert Map</CardTitle>
                <CardDescription>Real-time visualization of all SOS alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px]">
                  <SafetyMap userRole="volunteer" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
