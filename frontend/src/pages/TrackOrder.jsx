import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // VITAL: Ensure this is imported
import L from "leaflet";

// Fix for default marker icons not showing in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const socket = io("http://localhost:3000");

// Component to handle map behaviors when coordinates update
function MapController({ coords }) {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      // Force the map to recalculate its container size
      map.invalidateSize(); 
      // Smoothly pan to new coordinates
      map.setView([coords.latitude, coords.longitude], 15);
    }
  }, [coords, map]);
  
  return null;
}

const TrackOrder = () => {
  const { orderId } = useParams();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Join the specific room for this order
    socket.emit("join-tracking", orderId);
    
    // Listen for broadcasts from the server
    socket.on("location-update", (data) => {
      console.log("GPS Data Received:", data);
      setLocation(data);
    });

    return () => {
      socket.off("location-update");
    };
  }, [orderId]);

  return (
    <div className="p-10 font-poppins min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Live Tracking: Order #{orderId}
      </h2>
      
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {!location ? (
          <div className="h-[600px] flex flex-col items-center justify-center bg-blue-50/50">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-solid mb-4"></div>
            <p className="text-blue-900 font-semibold text-lg animate-pulse">
              Waiting for driver's GPS signal...
            </p>
            <p className="text-blue-600/70 text-sm mt-2">
              Please use PowerShell to send coordinates to Order #{orderId}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Status Header */}
            <div className="p-5 bg-green-600 text-white flex justify-between items-center shadow-md z-10">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 bg-white rounded-full animate-ping"></div>
                <span className="font-bold uppercase tracking-wider">Machinery En-Route</span>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">Current Coordinates</p>
                <p className="font-mono font-medium">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              </div>
            </div>
            
            {/* THE MAP CONTAINER: Ensure high z-index and fixed height */}
            <div className="relative" style={{ height: "600px", width: "100%", zIndex: 1 }}>
              <MapContainer 
                center={[location.latitude, location.longitude]} 
                zoom={15} 
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[location.latitude, location.longitude]}>
                  <Popup className="font-poppins">
                    <b>Machinery for Order #{orderId}</b><br />
                    Moving at current GPS location.
                  </Popup>
                </Marker>
                {/* Custom controller to handle updates */}
                <MapController coords={location} />
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;