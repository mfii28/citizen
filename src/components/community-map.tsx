"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { DISTRICT_CENTER } from "@/lib/communities";

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  tone: "critical" | "high" | "medium" | "low";
};

const TONE_COLORS: Record<MapPin["tone"], string> = {
  critical: "#dc2626",
  high: "#E8A233",
  medium: "#1E8AA8",
  low: "#3D9A6C",
};

export function CommunityMap({ pins }: { pins: MapPin[] }) {
  return (
    <MapContainer
      center={DISTRICT_CENTER}
      zoom={11}
      scrollWheelZoom={false}
      style={{ height: "520px", width: "100%", borderRadius: "16px", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lng]}
          radius={9}
          pathOptions={{
            color: TONE_COLORS[p.tone],
            fillColor: TONE_COLORS[p.tone],
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup>
            <p style={{ fontWeight: 600, margin: 0 }}>{p.title}</p>
            <p style={{ margin: "4px 0 0", fontSize: 13 }}>{p.description}</p>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
