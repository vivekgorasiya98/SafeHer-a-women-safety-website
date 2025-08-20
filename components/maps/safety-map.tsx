"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Shield, Users } from "lucide-react";

interface SafetyMapProps {
  userRole: "user" | "volunteer" | "admin";
}

interface MapMarker {
  id: string;
  x: number;
  y: number;
  type: "user" | "sos" | "volunteer" | "safe" | "risk";
  label: string;
  details?: string;
}

export function SafetyMap({ userRole }: SafetyMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [mapUrl, setMapUrl] = useState("");
  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  // Mock map markers positioned as percentages
  const markers: MapMarker[] = [
    {
      id: "user",
      x: 50,
      y: 50,
      type: "user",
      label: "Your Location",
      details: "Current position",
    },
    ...(userRole === "volunteer" || userRole === "admin"
      ? [
          {
            id: "sos1",
            x: 30,
            y: 25,
            type: "sos" as const,
            label: "Sarah M.",
            details: "SOS Alert - 2 min ago",
          },
          {
            id: "sos2",
            x: 70,
            y: 75,
            type: "sos" as const,
            label: "Anonymous",
            details: "SOS Alert - 15 min ago",
          },
        ]
      : []),
    ...(userRole === "user" || userRole === "admin"
      ? [
          {
            id: "vol1",
            x: 25,
            y: 60,
            type: "volunteer" as const,
            label: "Mike V.",
            details: "Available",
          },
          {
            id: "vol2",
            x: 80,
            y: 40,
            type: "volunteer" as const,
            label: "Emma S.",
            details: "Responding",
          },
        ]
      : []),
    {
      id: "safe1",
      x: 15,
      y: 20,
      type: "safe",
      label: "Police Station",
      details: "Safe Zone",
    },
    {
      id: "safe2",
      x: 85,
      y: 80,
      type: "safe",
      label: "Hospital",
      details: "Safe Zone",
    },
    {
      id: "risk1",
      x: 70,
      y: 75,
      type: "risk",
      label: "High Crime Area",
      details: "Exercise caution",
    },
  ];

  const getMarkerStyle = (marker: MapMarker) => {
    const baseStyle = {
      position: "absolute" as const,
      left: `${marker.x}%`,
      top: `${marker.y}%`,
      transform: "translate(-50%, -50%)",
      cursor: "pointer",
      zIndex: selectedMarker?.id === marker.id ? 20 : 10,
    };

    switch (marker.type) {
      case "user":
        return { ...baseStyle, color: "#3b82f6" };
      case "sos":
        return { ...baseStyle, color: "#ef4444" };
      case "volunteer":
        return { ...baseStyle, color: "#22c55e" };
      case "safe":
        return { ...baseStyle, color: "#22c55e", opacity: 0.7 };
      case "risk":
        return { ...baseStyle, color: "#ef4444", opacity: 0.7 };
      default:
        return baseStyle;
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "user":
        return <MapPin className="h-6 w-6" />;
      case "sos":
        return <AlertTriangle className="h-6 w-6" />;
      case "volunteer":
        return <Shield className="h-6 w-6" />;
      case "safe":
        return <Shield className="h-8 w-8" />;
      case "risk":
        return <AlertTriangle className="h-8 w-8" />;
      default:
        return <MapPin className="h-6 w-6" />;
    }
  };

  const getZoneStyle = (marker: MapMarker) => {
    if (marker.type !== "safe" && marker.type !== "risk") return {};

    return {
      position: "absolute" as const,
      left: `${marker.x}%`,
      top: `${marker.y}%`,
      transform: "translate(-50%, -50%)",
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      backgroundColor: marker.type === "safe" ? "#22c55e" : "#ef4444",
      opacity: 0.1,
      border: `2px solid ${marker.type === "safe" ? "#22c55e" : "#ef4444"}`,
      pointerEvents: "none" as const,
    };
  };
  interface SafetyMapProps {
    userRole: "user" | "volunteer" | "admin";
  }

  const fetchRoute = async (start: [number, number], end: [number, number]) => {
    const apiKey = "5b3ce3597851110001cf6248853e4fb71a0f4f0b9ca6f0fc3d61c9a7"; // replace with your real key
    const url = `https://api.openrouteservice.org/v2/directions/foot-walking/geojson`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [start, end],
      }),
    });

    const data = await response.json();
    return data; // contains geometry.coordinates
  };

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const delta = 0.005; // map bounds
          const bbox = [
            longitude - delta,
            latitude - delta,
            longitude + delta,
            latitude + delta,
          ].join(",");

          const url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
          setMapUrl(url);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // fallback location (example: Delhi)
          setMapUrl(
            "https://www.openstreetmap.org/export/embed.html?bbox=77.2,28.6,77.3,28.7&layer=mapnik&marker=28.65,77.25"
          );
        }
      );
    }
  }, []);

  const handleMarkerClick = async (marker: MapMarker) => {
    setSelectedMarker(marker);

    if (marker.type === "safe" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Convert mock x/y to approximate lat/lng offsets from user
        const deltaLat = (marker.y - 50) * 0.0015;
        const deltaLng = (marker.x - 50) * 0.0015;

        const destLat = userLat + deltaLat;
        const destLng = userLng + deltaLng;

        const route = await fetchRoute([userLng, userLat], [destLng, destLat]);
        setRouteGeoJSON(route);

        console.log("📍 Route:", route);
      });
    }
  };

 return (
  <div className="w-full h-full rounded-lg overflow-hidden border border-gray-300">
    {mapUrl ? (
      <div className="relative w-full h-[500px]">
        {/* Base map */}
        <iframe
          title="User Live Location Map"
          src={mapUrl}
          className="absolute top-0 left-0 w-full h-full z-0"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
        ></iframe>
        {/* 👇 Removed marker dots */}
      </div>
    ) : (
      <div className="flex items-center justify-center h-[500px] text-gray-600">
        Loading map...
      </div>
    )}

    {/* Route Step Display */}
    {routeGeoJSON && (
      <div className="p-2 text-sm text-gray-700 bg-gray-100 border-t border-gray-300 overflow-auto max-h-40">
        <p className="font-semibold mb-1">Route Steps:</p>
        <ul className="list-disc ml-5 space-y-1">
          {routeGeoJSON.features?.[0]?.properties?.segments?.[0]?.steps?.map(
            (step: any, index: number) => (
              <li key={index}>{step.instruction}</li>
            )
          )}
        </ul>
      </div>
    )}
  </div>
);


}
