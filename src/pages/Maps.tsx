import React, { useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { DivIcon, type LatLngExpression, latLngBounds } from "leaflet";
import { ChevronLeft, MapPin, Store } from "lucide-react";
import { stores } from "../data/dummy";
import "leaflet/dist/leaflet.css";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  SURABAYA_BOUNDS,
  STORE_ICON,
  SELECTED_ICON,
  getIconByCategory,
} from "../config/maps";

// Helper function to create custom marker with label
const createLabeledIcon = (storeName: string, category?: string, isSelected?: boolean) => {
  const categoryColors: Record<string, string> = {
    Makanan: "#F97316",
    Minuman: "#06B6D4", 
    Fashion: "#EC4899",
    Kerajinan: "#8B5CF6",
    Aksesoris: "#F59E0B",
    Kecantikan: "#FB7185",
    Toserba: "#10B981",
  };

  const categoryIcons: Record<string, string> = {
    Makanan: "/icons/makanan.webp",
    Minuman: "/icons/minuman.webp",
    Fashion: "/icons/fashion.webp",
    Kerajinan: "/icons/kerajinan.webp",
    Aksesoris: "/icons/aksesoris.webp",
    Kecantikan: "/icons/kecantikan.webp",
    Toserba: "/icons/toserba.webp",
  };

  const bgColor = isSelected ? "#2563EB" : (category ? categoryColors[category] : "#DC2626");
  const iconUrl = category ? categoryIcons[category] : null;
  
  return new DivIcon({
    html: `
      <div style="position: relative; text-align: center; display: inline-block;">
        <div style="
          background: ${bgColor};
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 3px 6px rgba(0,0,0,0.35);
          margin-bottom: 4px;
          display: inline-block;
        ">
          ${storeName}
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid ${bgColor};
          margin: 0 auto -6px;
        "></div>
        ${iconUrl ? `
          <img src="${iconUrl}" 
               style="
                 width: 64px !important; 
                 height: 64px !important; 
                 object-fit: contain;
                 display: block;
                 margin: 0 auto;
                 filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));
               " 
               alt="${category}" />
        ` : `
          <svg width="64" height="64" viewBox="0 0 24 24" style="display: block; margin: 0 auto; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));">
            <path fill="${bgColor}" stroke="#fff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        `}
      </div>
    `,
    className: "",
    iconSize: [120, 95],
    iconAnchor: [60, 95],
    popupAnchor: [0, -90],
  });
};

// Component to handle auto-opening popup for selected store (by center proximity)
const AutoOpenPopup: React.FC<{ storeId: string | null; center: LatLngExpression }> = ({ storeId, center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!storeId) return;
    
    // Zoom and center to the selected store
    map.setView(center, 16, { animate: true });
    
    // Small delay to ensure markers are rendered
    const timer = setTimeout(() => {
      const [clat, clng] = center as [number, number];
      const threshold = 0.0008; // ~<100m
      map.eachLayer((layer: any) => {
        if (typeof layer.getLatLng === "function") {
          const ll = layer.getLatLng();
          if (
            ll &&
            Math.abs(ll.lat - clat) < threshold &&
            Math.abs(ll.lng - clng) < threshold
          ) {
            layer.openPopup();
          }
        }
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [storeId, center, map]);
  
  return null;
};

export const Maps: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const lat = params.get("lat");
  const lng = params.get("lng");
  const storeId = params.get("storeId");
  const label = params.get("q") || params.get("label") || "Lokasi UMKM";

  // Parse koordinat dari URL atau ambil dari data stores
  let center: LatLngExpression = DEFAULT_CENTER; // Default Surabaya
  let selectedStore = null;

  if (lat && lng) {
    center = [parseFloat(lat), parseFloat(lng)];
  }

  // Jika ada storeId, cari store yang sesuai
  if (storeId) {
    selectedStore = stores.find(s => s.id === storeId);
    if (selectedStore && typeof selectedStore.lat === "number" && typeof selectedStore.lng === "number") {
      center = [selectedStore.lat, selectedStore.lng];
    } else if (selectedStore?.mapUrl) {
      const qIndex = selectedStore.mapUrl.indexOf("q=");
      if (qIndex !== -1) {
        const q = selectedStore.mapUrl.substring(qIndex + 2);
        const [latStr, lngStr] = q.split(",");
        if (latStr && lngStr) {
          center = [parseFloat(latStr), parseFloat(lngStr)];
        }
      }
    }
  }

  // Ambil semua koordinat toko untuk ditampilkan sebagai marker
  const storeMarkers = stores
    .map(store => {
      if (typeof store.lat === "number" && typeof store.lng === "number") {
        return {
          ...store,
          position: [store.lat, store.lng] as LatLngExpression,
        };
      }
      const qIndex = store.mapUrl?.indexOf("q=");
      if (qIndex !== -1) {
        const q = store.mapUrl.substring(qIndex + 2);
        const [latStr, lngStr] = q.split(",");
        if (latStr && lngStr) {
          return {
            ...store,
            position: [parseFloat(latStr), parseFloat(lngStr)] as LatLngExpression,
          };
        }
      }
      return null;
    })
    .filter(Boolean);

  // Fit all markers when no specific store or coordinate is requested
  const FitAllStores: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      if ((lat && lng) || storeId) return;
      const positions = (storeMarkers as any[]).map((s) => s.position);
      if (positions.length > 0) {
        const bounds = latLngBounds(positions);
        map.fitBounds(bounds, { padding: [60, 60] });
      }
    }, [map]);
    return null;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-2 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-blue-700 transition mb-3"
        >
          <ChevronLeft size={20} />
          <span>Kembali</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2 px-2">
          <MapPin className="text-green-600" size={28} />
          {selectedStore ? selectedStore.name : label}
        </h1>

        <div className="bg-white rounded-xl shadow overflow-hidden" style={{ height: "80vh" }}>
          <MapContainer
            center={center}
            zoom={lat && lng ? 15 : DEFAULT_ZOOM}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
            maxBounds={SURABAYA_BOUNDS}
            maxBoundsViscosity={0.75}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marker tunggal jika ada koordinat spesifik */}
            {lat && lng && !storeId && (
              <Marker position={center} icon={SELECTED_ICON}>
                <Popup>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{label}</p>
                    <p className="text-sm text-gray-600">
                      {lat}, {lng}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Marker untuk semua toko atau toko terpilih */}
            {storeMarkers.map((store: any) => {
              const isSelected = selectedStore?.id === store.id;
              const labeledIcon = createLabeledIcon(store.name, store.category, isSelected);
              return (
                <Marker
                  key={store.id}
                  position={store.position}
                  icon={labeledIcon}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-start gap-2 mb-2">
                        <Store className="text-green-600 flex-shrink-0 mt-1" size={20} />
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{store.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">{store.address}</p>
                          {store.category && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {store.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 text-xs mb-2">
                        <span>⭐</span>
                        <span className="font-semibold">{store.rating}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/store/${store.id}`)}
                        className="w-full px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-green-500 text-white text-xs font-semibold rounded hover:shadow-md transition"
                      >
                        Lihat Detail Toko
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
            
            {/* Auto-open popup for selected store */}
            <AutoOpenPopup storeId={storeId} center={center} />
            {/* Fit all stores by default */}
            <FitAllStores />
          </MapContainer>
        </div>

        {/* Info untuk user */}
        <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200 mx-2">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">💡 Tips:</span> Ketuk ikon pada peta untuk melihat detail toko. Gunakan cubit/scroll untuk zoom dan geser peta untuk menjelajah.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Maps;
