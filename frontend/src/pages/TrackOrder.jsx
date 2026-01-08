import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
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
// If testing with a phone, replace 'localhost' with your laptop's IP (e.g., "http://192.168.1.5:3000")
const socket = io("http://localhost:3000"); 

// Helper component to smoothly pan the map when coords change
function MapController({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.latitude, coords.longitude], 15);
    }
  }, [coords, map]);
  return null;
}

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("Waiting for driver signal...");

  useEffect(() => {
    // 1. Join the tracking room
    console.log(`🔵 Joining tracking room: order_${orderId}`);
    socket.emit("join-tracking", orderId);
    
    // 2. Handle Reconnection
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

    // 4. Listen for Delivery Completion (Redirects to RateOrder)
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

  return (
    <div className="p-4 font-poppins min-h-screen bg-gray-50 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Tracking Order #{orderId}
      </h2>
      
      {/* Live Status Badge */}
      <div className={`mb-4 px-4 py-2 rounded-full text-sm font-bold shadow-sm transition-colors duration-300 ${location ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
        <span className="mr-2">{location ? "●" : "○"}</span>
        Status: {status}
      </div>
      
      {/* Map Container */}
      <div className="w-full max-w-5xl h-[600px] bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 relative z-0">
        {!location ? (
          <div className="h-full flex flex-col items-center justify-center bg-blue-50/50 text-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid mb-4"></div>
            <h3 className="text-xl font-bold text-blue-900">Waiting for Driver GPS...</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              The map will load automatically once the driver clicks "Start Delivery" on their device.
            </p>
          </div>
        ) : (
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
              <Popup>
                <div className="text-center">
                  <b>🚜 Farm Equipment</b><br />
                  Current Location<br/>
                  <span className="text-xs text-gray-500">
                    {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                  </span>
                </div>
              </Popup>
            </Marker>
            <MapController coords={location} />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;