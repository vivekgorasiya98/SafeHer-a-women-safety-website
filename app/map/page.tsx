"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Navigation, AlertTriangle, Users, Search, Phone } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SafetyMap } from "@/components/maps/safety-map"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api";  
import { queryHuggingFace } from "@/lib/hfClient";
export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [mapData, setMapData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
  const loadMapData = async () => {
    try {
      const res = await apiClient.getMapData()
      if (res.success) setMapData(res.data)
      else throw new Error(res.error)
    } catch (error) {
      console.error("Failed to load map data:", error)
      toast({
        title: "Map Data Error",
        description: "Failed to load map data. Using offline mode.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  loadMapData()
}, [toast])


  const handleGetDirections = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter Destination",
        description: "Please enter a destination to get directions.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Getting Directions",
      description: `Finding the safest route to ${searchQuery}...`,
      className: "border-teal-200 bg-teal-50 text-teal-800",
    })
  }

  const handleShareLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await apiClient.updateLocation(position.coords.latitude, position.coords.longitude)
            toast({
              title: "Location Shared",
              description: "Your location has been shared with emergency contacts.",
              className: "border-turquoise-200 bg-turquoise-50 text-turquoise-800",
            })
          } catch (error) {
            toast({
              title: "Location Share Failed",
              description: "Failed to share your location. Please try again.",
              variant: "destructive",
            })
          }
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enable location services.",
            variant: "destructive",
          })
        },
      )
    }
  }

  const handleReportIncident = () => {
    toast({
      title: "Opening Report Form",
      description: "Redirecting to incident reporting...",
      className: "border-purple-200 bg-purple-50 text-purple-800",
    })
    router.push("/report")
  }

  const handleRequestHelp = async () => {
    try {
      // This would create an SOS alert in a real implementation
      toast({
        title: "Help Requested",
        description: "Nearby volunteers have been notified of your request.",
        className: "border-red-200 bg-red-50 text-red-800",
      })
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to send help request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFindSafePlace = async () => {
    toast({
      title: "Finding Safe Places",
      description: "AI is suggesting safe locations near you...",
      className: "border-teal-200 bg-teal-50 text-teal-800",
    });
    console.log("Searching for safe places...");
    const response = await queryHuggingFace(`Find safe places near ${searchQuery || "my location"}`);

    if (response) {
      console.log("AI Safe Place Suggestion:", response);
      toast({
        title: "AI Suggestion",
        description: JSON.stringify(response),
        className: "border-green-200 bg-green-50 text-green-800",
      });
    }
  };

  const handleNavigateToLocation = (location: string) => {
    toast({
      title: "Navigation Started",
      description: `Getting directions to ${location}...`,
      className: "border-turquoise-200 bg-turquoise-50 text-turquoise-800",
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-navy-600">Loading map data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Safety Map</h1>
            <p className="text-navy-600">Navigate safely with real-time safety information</p>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white" onClick={handleShareLocation}>
              <MapPin className="h-4 w-4 mr-2" />
              Share Location
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
              onClick={handleRequestHelp}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Request Help
            </Button>
          </div>
        </div>

        {/* Search and Quick Actions */}
        <Card className="border-navy-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-navy-900">Navigation & Quick Actions</CardTitle>
            <CardDescription className="text-navy-600">Search for destinations and access safety tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for a destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500"
                />
              </div>
              <Button onClick={handleGetDirections} className="bg-teal-500 hover:bg-teal-600 text-white">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button
                onClick={handleFindSafePlace}
                variant="outline"
                className="border-teal-300 text-teal-700 hover:bg-teal-50 bg-transparent"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Find Safe Place
              </Button>

              <Button
                onClick={handleReportIncident}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Incident
              </Button>

              <Button
                onClick={() => router.push("/community")}
                variant="outline"
                className="border-turquoise-300 text-turquoise-700 hover:bg-turquoise-50 bg-transparent"
              >
                <Users className="h-4 w-4 mr-2" />
                Find Volunteers
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Map */}
        <Card>
          <CardHeader>
            <CardTitle>Live Safety Map</CardTitle>
            <CardDescription>Real-time safety information and volunteer locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <SafetyMap userRole="user" />
            </div>
          </CardContent>
        </Card>

        {/* Nearby Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Nearby Safe Places</CardTitle>
              <CardDescription>Emergency services and safe zones near you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-teal-100">
                      <MapPin className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-900">Police Station</p>
                      <p className="text-sm text-navy-600">0.3 miles away</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleNavigateToLocation("Police Station")}>
                    Navigate
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-turquoise-100">
                      <MapPin className="h-4 w-4 text-turquoise-600" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-900">Hospital</p>
                      <p className="text-sm text-navy-600">0.7 miles away</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleNavigateToLocation("Hospital")}>
                    Navigate
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-purple-100">
                      <MapPin className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-900">Safe Zone - Mall</p>
                      <p className="text-sm text-navy-600">0.5 miles away</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleNavigateToLocation("Safe Zone - Mall")}>
                    Navigate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Volunteers</CardTitle>
              <CardDescription>Verified volunteers available to help</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-teal-100">
                      <Users className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-900">Sarah V.</p>
                      <p className="text-sm text-navy-600">0.2 miles away • Available</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-turquoise-100">
                      <Users className="h-4 w-4 text-turquoise-600" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-900">Mike R.</p>
                      <p className="text-sm text-navy-600">0.4 miles away • Available</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-turquoise-500 hover:bg-turquoise-600">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-purple-100">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-900">Emma L.</p>
                      <p className="text-sm text-navy-600">0.6 miles away • Responding</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">Busy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
