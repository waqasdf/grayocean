import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

const stateCoordinates = {
  'New Hampshire': [43.1939, -71.5724],
  'Maine': [45.2538, -69.4455],
  'Vermont': [44.5588, -72.5778],
  'Massachusetts': [42.4072, -71.3824],
  'Rhode Island': [41.5801, -71.4774],
  'Connecticut': [41.6032, -73.0877],
  'New York': [43.2994, -74.2179],
  'New Jersey': [40.0583, -74.4057],
  'Pennsylvania': [41.2033, -77.1945],
  'Maryland': [39.0458, -76.6413],
  'Delaware': [38.9108, -75.5277],
  'Virginia': [37.4316, -78.6569],
  'West Virginia': [38.5976, -80.4549],
  'North Carolina': [35.7596, -79.0193],
  'South Carolina': [33.8361, -81.1637],
  'Georgia': [32.1656, -82.9001],
  'Florida': [27.6648, -81.5158],
  'Ohio': [40.4173, -82.9071],
  'Indiana': [40.2672, -86.1349],
  'Illinois': [40.6331, -89.3985],
  'Michigan': [44.3148, -85.6024],
  'Wisconsin': [43.7844, -88.7879],
  'Kentucky': [37.8393, -84.2700],
  'Tennessee': [35.5175, -86.5804],
  'Alabama': [32.3182, -86.9023],
  'Mississippi': [32.3547, -89.3985],
  'Arkansas': [35.2010, -91.8318],
  'Louisiana': [30.9843, -91.9623],
  'Oklahoma': [35.4676, -97.5164],
  'Texas': [31.9686, -99.9018],
  'Minnesota': [46.7296, -94.6859],
  'Iowa': [41.8780, -93.0977],
  'Missouri': [37.9643, -91.8318],
  'North Dakota': [47.5515, -101.0020],
  'South Dakota': [43.9695, -99.9018],
  'Nebraska': [41.4925, -99.9018],
  'Kansas': [39.0119, -98.4842],
  'Montana': [46.8797, -110.3626],
  'Idaho': [44.0682, -114.7420],
  'Wyoming': [43.0760, -107.2903],
  'Colorado': [39.5501, -105.7821],
  'New Mexico': [34.5199, -105.8701],
  'Arizona': [34.0489, -111.0937],
  'Utah': [39.3210, -111.0937],
  'Nevada': [38.8026, -116.4194],
  'Washington': [47.7511, -120.7401],
  'Oregon': [43.8041, -120.5542],
  'California': [36.7783, -119.4179],
  'Alaska': [64.2008, -149.4937],
  'Hawaii': [19.8968, -155.5828],
};

function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 6, { duration: 1.5 });
    }
  }, [center, map]);
  
  return null;
}

const getRiskColor = (riskLevel) => {
  switch (riskLevel) {
    case 'high':
      return '#ef4444';
    case 'medium':
      return '#f59e0b';
    case 'low':
      return '#10b981';
    default:
      return '#6b7280';
  }
};

const getRiskLabel = (riskLevel, riskScore) => {
  return `${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk (${riskScore}/100)`;
};

export default function GeoMap({ searches = [] }) {
  const defaultCenter = [39.8283, -98.5795];
  const latestSearch = searches[searches.length - 1];
  const mapCenter = latestSearch?.coordinates || defaultCenter;

  return (
    <div className="bg-[hsl(0,0%,9%)] border border-white/10 rounded-lg overflow-hidden hover:border-purple-500/30 transition-all">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/5 via-gray-500/5 to-blue-500/5">
        <h3 className="text-xs font-medium text-white">Geographic Distribution</h3>
        <div className="text-[10px] text-gray-500">
          {searches.length} {searches.length === 1 ? 'lookup' : 'lookups'}
        </div>
      </div>
      
      <div className="relative h-[240px] bg-[hsl(0,0%,9%)] sm:h-[320px] md:h-[400px]">
        <MapContainer
          center={defaultCenter}
          zoom={4}
          style={{ height: '100%', width: '100%', background: 'hsl(0, 0%, 9%)' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          <MapUpdater center={mapCenter} />
          
          {searches.map((search, index) => {
            const color = getRiskColor(search.riskLevel);
            return (
              search.coordinates && (
                <CircleMarker
                  key={index}
                  center={search.coordinates}
                  radius={8}
                  fillColor={color}
                  color={color}
                  fillOpacity={0.6}
                  opacity={0.8}
                  weight={2}
                >
                  <Popup className="custom-popup">
                    <div className="text-[10px]">
                      <div className="font-medium text-white mb-1">{search.state}</div>
                      <div className="text-gray-400 mb-1">{search.timestamp}</div>
                      <div 
                        className="mt-1 text-[10px] font-medium"
                        style={{ color }}
                      >
                        {getRiskLabel(search.riskLevel, search.riskScore)}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${search.isValid ? 'text-gray-400' : 'text-gray-500'}`}>
                        {search.isValid ? 'Valid Format' : 'Invalid Format'}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            );
          })}
        </MapContainer>
      </div>

      <div className="flex items-center justify-center gap-6 p-3 border-t border-white/10 bg-gradient-to-r from-blue-500/5 via-gray-500/5 to-blue-500/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
          <span className="text-[10px] text-gray-400">Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"></div>
          <span className="text-[10px] text-gray-400">Medium Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500"></div>
          <span className="text-[10px] text-gray-400">High Risk</span>
        </div>
      </div>
    </div>
  );
}

export { stateCoordinates };