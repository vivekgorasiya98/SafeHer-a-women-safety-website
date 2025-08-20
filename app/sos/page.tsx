"use client";

import { useState } from "react";
import { Phone, MapPin } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { SOSButton } from "@/components/safety/sos-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function SosPage() {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const { toast } = useToast();

  const handleSOSAlert = async () => {
    setIsSOSActive(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const response = await apiClient.createSOSAlert({
            latitude,
            longitude,
            message: "Urgent help needed",
            priority: "high",
          });

          if (response.success) {
            toast({
              title: "SOS Alert Activated!",
              description: "Your location has been shared. Help is on the way.",
              className: "border-red-200 bg-red-50 text-red-800",
            });
          } else {
            toast({
              title: "Failed to Activate SOS",
              description: response.error || "Try again later.",
              variant: "destructive",
            });
          }
        },
        () => {
          toast({
            title: "Location Error",
            description: "Please enable location permissions to send SOS.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleQuickCall = (number: string, service: string) => {
    toast({
      title: `Calling ${service}`,
      description: `Dialing ${number}...`,
      className: "border-turquoise-200 bg-turquoise-50 text-turquoise-800",
    });
    window.open(`tel:${number}`);
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          toast({
            title: "Location Shared",
            description: "Your location has been shared with emergency contacts.",
            className: "border-teal-200 bg-teal-50 text-teal-800",
          });
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enable location services.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleFakeCall = () => {
    toast({
      title: "Fake Call Started",
      description: "Simulating an incoming call to help you exit safely.",
      className: "border-purple-200 bg-purple-50 text-purple-800",
    });
  };

  function handleActivate(): void {
    handleSOSAlert();
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-purple-900 to-gray-900 px-4 py-10 text-white">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-white mb-6 tracking-wide">SOS Emergency</h1>

        <SOSButton onActivate={handleActivate} />

        <p className="text-sm text-gray-300 mt-6">
          Your alert will be sent to all nearby verified volunteers and authorities.
        </p>
      </div>
    </div>
  ) 
}
