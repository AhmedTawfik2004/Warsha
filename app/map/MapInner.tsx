"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Lang } from "../lib/translations";

export interface MapShop {
  id: number;
  name: string;
  area: { ar: string; en: string };
  rating: number;
  reviews: number;
  lat: number;
  lng: number;
  accent: string;
  phone?: string | null;
}

interface CairoMapProps {
  shops: MapShop[];
  theme: "dark" | "light";
  lang: Lang;
  selectedId: number | null;
}

const CAIRO_CENTER: [number, number] = [30.0444, 31.2357];

function markerIcon(color: string, selected: boolean) {
  const size = selected ? 18 : 13;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.3),0 2px 6px rgba(0,0,0,.3);transition:all .2s"></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -(size/2 + 4)],
  });
}

function FlyToSelected({ shops, selectedId, markerRefs }: {
  shops: MapShop[];
  selectedId: number | null;
  markerRefs: React.MutableRefObject<Record<number, L.Marker | null>>;
}) {
  const map = useMap();
  useEffect(() => {
    if (selectedId == null) return;
    const shop = shops.find(s => s.id === selectedId);
    if (!shop) return;
    map.flyTo([shop.lat, shop.lng], 16, { duration: 0.8 });
    const marker = markerRefs.current[selectedId];
    if (marker) window.setTimeout(() => marker.openPopup(), 500);
  }, [selectedId, shops, map, markerRefs]);
  return null;
}

function SatelliteToggle({ isSatellite, onToggle, lang }: { isSatellite: boolean; onToggle: () => void; lang: Lang }) {
  return (
    <div style={{
      position: "absolute", top: 12, right: 12, zIndex: 1000,
    }}>
      <button onClick={onToggle} style={{
        padding: "7px 13px", borderRadius: 8, fontSize: 12, fontWeight: 700,
        background: "var(--bg-card)", border: "1.5px solid var(--border)",
        cursor: "pointer", fontFamily: "inherit", color: "var(--text-primary)",
        boxShadow: "0 2px 8px rgba(0,0,0,.15)",
      }}>
        {isSatellite
          ? (lang === "ar" ? "🗺️ خريطة عادية" : "🗺️ Map")
          : (lang === "ar" ? "🛰️ قمر صناعي" : "🛰️ Satellite")}
      </button>
    </div>
  );
}

export default function CairoMap({ shops, theme, lang, selectedId }: CairoMapProps) {
  const markerRefs = useRef<Record<number, L.Marker | null>>({});
  const [isSatellite, setIsSatellite] = useState(false);

  const openDirections = (shop: MapShop) => {
    // Opens Google Maps navigation from user's current location to the shop
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}&travelmode=driving`,
      "_blank"
    );
  };

  return (
    <>
      <style>{`
        .leaflet-container { background: var(--bg-secondary); font-family: inherit; border-radius: var(--radius-lg); }
        .map-dark .leaflet-tile-pane { filter: invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.9); }
        .map-dark.map-satellite .leaflet-tile-pane { filter: none; }
        .leaflet-popup-content-wrapper { background: var(--bg-card) !important; color: var(--text-primary) !important; border-radius: var(--radius-md) !important; box-shadow: var(--shadow-md) !important; border: 1px solid var(--border); padding: 0; }
        .leaflet-popup-content { margin: 0; }
        .leaflet-popup-tip { background: var(--bg-card) !important; }
        .leaflet-container a.leaflet-popup-close-button { color: var(--text-secondary); top: 6px; right: 6px; }
        .leaflet-control-zoom a { background: var(--bg-card) !important; color: var(--text-primary) !important; border-color: var(--border) !important; }
        .leaflet-attribution-flag { display: none !important; }
      `}</style>

      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <MapContainer
          center={CAIRO_CENTER}
          zoom={12}
          scrollWheelZoom={true}
          className={`${theme === "dark" ? "map-dark" : ""} ${isSatellite ? "map-satellite" : ""}`}
          style={{ height: "100%", width: "100%", borderRadius: "var(--radius-lg)" }}
        >
          {isSatellite ? (
            <TileLayer
              attribution='&copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          ) : (
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          {shops.map(shop => (
            <Marker
              key={shop.id}
              position={[shop.lat, shop.lng]}
              icon={markerIcon(shop.accent, selectedId === shop.id)}
              ref={ref => { markerRefs.current[shop.id] = ref; }}
            >
              <Popup>
                <div style={{ fontFamily: "inherit", minWidth: 180, padding: "12px 14px" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)", marginBottom: 3 }}>
                    {shop.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                    📍 {shop.area[lang]}
                  </div>
                  <div style={{ fontSize: 12, marginBottom: 10 }}>
                    <span style={{ color: "#F59E0B" }}>★</span>
                    <span style={{ fontWeight: 700, color: "var(--text-primary)", marginLeft: 4 }}>{shop.rating}</span>
                    {shop.reviews > 0 && (
                      <span style={{ color: "var(--text-tertiary)", marginLeft: 4 }}>({shop.reviews})</span>
                    )}
                  </div>
                  {/* Directions button — opens Google Maps navigation from user's location */}
                  <button
                    onClick={() => openDirections(shop)}
                    style={{
                      width: "100%", padding: "8px 0", borderRadius: 8,
                      background: "#E8730A", color: "#fff", border: "none",
                      cursor: "pointer", fontSize: 12, fontWeight: 700,
                      fontFamily: "inherit", marginBottom: shop.phone ? 6 : 0,
                    }}
                  >
                    {lang === "ar" ? "🗺️ الاتجاهات" : "🗺️ Get directions"}
                  </button>
                  {shop.phone && (
                    <button
                      onClick={() => window.open(`https://wa.me/${shop.phone!.replace(/\D/g, "")}`, "_blank")}
                      style={{
                        width: "100%", padding: "8px 0", borderRadius: 8,
                        background: "#25D366", color: "#fff", border: "none",
                        cursor: "pointer", fontSize: 12, fontWeight: 700,
                        fontFamily: "inherit",
                      }}
                    >
                      {lang === "ar" ? "💬 واتساب" : "💬 WhatsApp"}
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          <FlyToSelected shops={shops} selectedId={selectedId} markerRefs={markerRefs} />
        </MapContainer>

        <SatelliteToggle isSatellite={isSatellite} onToggle={() => setIsSatellite(v => !v)} lang={lang} />
      </div>
    </>
  );
}