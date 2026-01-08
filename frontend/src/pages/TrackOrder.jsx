import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate (Teammate's feature)
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; 
import L from "leaflet";

// --- Fix Leaflet Default Icon Issue ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ⚠️ SOCKET CONNECTION
const socket = io("http://localhost:3000"); 

// Helper component (Using YOUR version because invalidateSize is safer)
function MapController({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.invalidateSize(); // Prevents gray box glitches
      map.setView([coords.latitude, coords.longitude], 15);
    }
  }, [coords, map]);
  return null;
}

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate(); // For redirecting when delivered
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("Waiting for driver signal...");

  useEffect(() => {
    // 1. Join the tracking room
    console.log(`🔵 Joining tracking room: order_${orderId}`);
    socket.emit("join-tracking", orderId);
    
    // 2. Handle Reconnection (Teammate's feature - Robustness)
    socket.on("connect", () => {
        console.log("✅ Reconnected to Server");
        socket.emit("join-tracking", orderId);
    });

    // 3. Listen for GPS Updates
    socket.on("location-update", (data) => {
      console.log("📍 GPS Update Received:", data);
      setLocation(data);
      setStatus("Driver is Live & Moving");
    });

    // 4. Listen for Delivery Completion (Teammate's feature - UX)
    socket.on("order-status-change", (data) => {
        console.log("🔔 Order Status Update:", data.status);
        if (data.status === 'Delivered') {
            alert("Order Delivered! Redirecting to feedback...");
            navigate(`/rate-order/${orderId}`);
        }
    });

    return () => {
      socket.off("location-update");
      socket.off("connect");
      socket.off("order-status-change");
    };
  }, [orderId, navigate]);

  // --- RENDERING (Using YOUR Better Design) ---
  return (
    <div className="p-10 font-poppins min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Live Tracking: Order #{orderId}
      </h2>
      
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {!location ? (
          // Loading State (Your Design)
          <div className="h-[600px] flex flex-col items-center justify-center bg-blue-50/50">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-solid mb-4"></div>
            <p className="text-blue-900 font-semibold text-lg animate-pulse">
              {status}
            </p>
            <p className="text-blue-600/70 text-sm mt-2">
              Waiting for driver to start the delivery...
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Status Header (Your Design + Dynamic Status) */}
            <div className="p-5 bg-green-600 text-white flex justify-between items-center shadow-md z-10">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 bg-white rounded-full animate-ping"></div>
                <span className="font-bold uppercase tracking-wider">{status}</span>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">Current Coordinates</p>
                <p className="font-mono font-medium">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              </div>
            </div>
            
            {/* Map Container (Your Design with fixed height) */}
            <div className="relative" style={{ height: "600px", width: "100%", zIndex: 1 }}>
              <MapContainer 
                center={[location.latitude, location.longitude]} 
                zoom={15} 
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <Marker position={[location.latitude, location.longitude]}>
                  <Popup className="font-poppins">
                    <b>🚜 Machinery</b><br />
                    {status}
                  </Popup>
                </Marker>
                {/* Controller for smooth updates */}
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