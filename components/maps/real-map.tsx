"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react"

interface RealMapProps {
  userRole: "user" | "volunteer" | "admin"
}
export default function RealMap() {
  return (
    <MapContainer
      center={[28.6139, 77.209]} // Delhi coordinates
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[28.6139, 77.209]}>
        <Popup>You are here</Popup>
      </Marker>
    </MapContainer>
  );
}
