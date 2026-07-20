import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function AddressMap({ latitude, longitude, address, neighborhoodScore }) {
  if (!latitude || !longitude) return null;

  const position = [latitude, longitude];
  const getScoreColor = (score) => {
    if (score >= 80) return '#3b82f6';
    if (score >= 60) return '#22c55e';
    if (score >= 40) return '#f59e0b';
    return '#71717a';
  };

  return (
    <Card className="go-panel shadow-none overflow-hidden">
      <CardHeader className="border-b border-[color:var(--go-border)] px-4 py-3">
        <CardTitle className="text-[12px] font-medium text-[color:var(--go-text-secondary)]">
          Location Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] relative">
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {/* Main marker */}
            <Marker position={position}>
              <Popup>
                <div className="text-xs">
                  <div className="font-semibold mb-1">{address}</div>
                  {neighborhoodScore && (
                    <div className="text-gray-600">Score: {neighborhoodScore}/100</div>
                  )}
                </div>
              </Popup>
            </Marker>

            {/* Radius circle showing neighborhood area */}
            {neighborhoodScore && (
              <Circle
                center={position}
                radius={800}
                pathOptions={{
                  color: getScoreColor(neighborhoodScore),
                  fillColor: getScoreColor(neighborhoodScore),
                  fillOpacity: 0.1,
                  weight: 2
                }}
              />
            )}
          </MapContainer>
        </div>
        
        <div className="px-4 py-3 border-t border-[color:var(--go-border)] bg-[var(--go-bg-card)]">
          <div className="text-[12px] text-[color:var(--go-text-muted)] font-mono">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
