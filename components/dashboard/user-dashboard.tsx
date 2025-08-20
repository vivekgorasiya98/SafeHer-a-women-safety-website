"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Users,
  Shield,
  Phone,
  MessageSquare,
  Navigation,
} from "lucide-react";
import { DashboardLayout } from "./dashboard-layout";
import { SafetyMap } from "@/components/maps/safety-map";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

export function UserDashboard() {
  const [nearbyVolunteers, setNearbyVolunteers] = useState(0);
  const [safetyScore, setSafetyScore] = useState(85);
  const [recentAlerts, setRecentAlerts] = useState(2);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
  const loadStats = async () => {
    try {
      const response = await apiClient.getSafetyStats();
      if (response.success) {
        setStats(response.data);
        setNearbyVolunteers(response.data.active_volunteers || 0);
      } else {
        console.error("❌ Failed to load stats:", response.error);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  loadStats();
}, []);


  const handleFindSafeRoute = () => {
    toast({
      title: "Finding Safe Route",
      description: "Calculating the safest path to your destination...",
      className: "border-teal-200 bg-teal-50 text-teal-800",
    });
    router.push("/map");
  };

  const handleCallEmergencyContacts = async () => {
    toast({
      title: "Calling Emergency Contacts",
      description: "Notifying your emergency contacts...",
      className: "border-purple-200 bg-purple-50 text-purple-800",
    });
    // In a real app, this would call the emergency contacts API
  };

  const handleReportIncident = () => {
    toast({
      title: "Opening Report Form",
      description: "Redirecting to incident reporting...",
      className: "border-turquoise-200 bg-turquoise-50 text-turquoise-800",
    });
    router.push("/report");
  };

  const handleJoinCommunity = () => {
    toast({
      title: "Joining Community",
      description: "Opening community forum...",
      className: "border-navy-200 bg-navy-50 text-navy-800",
    });
    router.push("/community");
  };

const handleShareLocation = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await apiClient.updateLocation(
            position.coords.latitude,
            position.coords.longitude
          )
          toast({
            title: "Location Updated",
            description:
              "Your location has been shared with trusted contacts.",
            className: "border-teal-200 bg-teal-50 text-teal-800",
          })
        } catch (error) {
          toast({
            title: "Location Update Failed",
            description: "Failed to update your location. Please try again.",
            variant: "destructive",
          })
        }
      },
      (error) => {
        toast({
          title: "Location Error",
          description:
            "Unable to get your location. Please enable location services.",
          variant: "destructive",
        })
      }
    )
  }
}


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">
              Safety Dashboard
            </h1>
            <p className="text-navy-600">
              Stay safe and connected with your community
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-teal-500" />
            <Badge className="bg-teal-100 text-teal-700 border-teal-200">
              Protected User
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-navy-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-navy-900">Quick Actions</CardTitle>
            <CardDescription className="text-navy-600">
              Emergency tools and safety features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={handleFindSafeRoute}
                className="h-20 flex flex-col items-center justify-center bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Navigation className="h-6 w-6 mb-2" />
                <span className="text-sm">Find Safe Route</span>
              </Button>

              <Button
                onClick={handleCallEmergencyContacts}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
              >
                <Phone className="h-6 w-6 mb-2" />
                <span className="text-sm">Call Emergency</span>
              </Button>

              <Button
                onClick={handleReportIncident}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center border-turquoise-300 text-turquoise-700 hover:bg-turquoise-50 bg-transparent"
              >
                <AlertTriangle className="h-6 w-6 mb-2" />
                <span className="text-sm">Report Incident</span>
              </Button>

              <Button
                onClick={handleJoinCommunity}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center border-navy-300 text-navy-700 hover:bg-navy-50 bg-transparent"
              >
                <MessageSquare className="h-6 w-6 mb-2" />
                <span className="text-sm">Community</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-teal-200 bg-teal-50/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">
                Nearby Volunteers
              </CardTitle>
              <Users className="h-4 w-4 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">
                {nearbyVolunteers}
              </div>
              <p className="text-xs text-teal-500">Available to help</p>
            </CardContent>
          </Card>

          <Card className="border-turquoise-200 bg-turquoise-50/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-turquoise-700">
                Safety Score
              </CardTitle>
              <Shield className="h-4 w-4 text-turquoise-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-turquoise-600">
                {safetyScore}%
              </div>
              <p className="text-xs text-turquoise-500">Current area safety</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Recent Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {recentAlerts}
              </div>
              <p className="text-xs text-purple-500">In your area today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Safety Map */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Live Safety Map</CardTitle>
              <CardDescription>
                Real-time safety information in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <SafetyMap userRole="user" />
              </div>
            </CardContent>
          </Card>

          {/* Safety Tips & Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Safety Updates</CardTitle>
              <CardDescription>
                Latest safety tips and community alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      New safe zone added near Central Park
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <Badge className="bg-teal-100 text-teal-700">Safe Zone</Badge>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-turquoise-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Increased volunteer presence in downtown area
                    </p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                  <Badge className="bg-turquoise-100 text-turquoise-700">
                    Update
                  </Badge>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Safety tip: Always trust your instincts
                    </p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700">Tip</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
            <CardDescription>
              Quick access to your emergency contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-red-100">
                    <Phone className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-navy-900">
                      Emergency Services
                    </p>
                    <p className="text-sm text-navy-600">911</p>
                  </div>
                </div>
                <Button size="sm" className="bg-red-500 hover:bg-red-600">
                  Call
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-teal-100">
                    <Phone className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium text-navy-900">Family Contact</p>
                    <p className="text-sm text-navy-600">+1-555-0123</p>
                  </div>
                </div>
                <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                  Call
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-purple-100">
                    <Phone className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-navy-900">Trusted Friend</p>
                    <p className="text-sm text-navy-600">+1-555-0456</p>
                  </div>
                </div>
                <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                  Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
