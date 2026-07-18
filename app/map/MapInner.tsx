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

const CAIRO_CENTER: [number, number] = [30.0444, 31.4];

function markerIcon(color: string, selected: boolean) {
  const size = selected ? 22 : 14;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.25),0 3px 8px rgba(0,0,0,.35);transition:all .2s;${selected ? "transform:scale(1.2)" : ""}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -(size/2 + 6)],
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
    map.flyTo([shop.lat, shop.lng], 16, { duration: 0.9 });
    const marker = markerRefs.current[selectedId];
    if (marker) window.setTimeout(() => marker.openPopup(), 600);
  }, [selectedId, shops, map, markerRefs]);
  return null;
}

function MapControls({ isSatellite, onToggle, lang }: { isSatellite: boolean; onToggle: () => void; lang: Lang }) {
  return (
    <div style={{ position: "absolute", top: 12, right: 12, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8 }}>
      <button onClick={onToggle} style={{
        padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700,
        background: "var(--bg-card)", border: "1.5px solid var(--border)",
        cursor: "pointer", fontFamily: "inherit", color: "var(--text-primary)",
        boxShadow: "0 2px 8px rgba(0,0,0,.2)", whiteSpace: "nowrap",
      }}>
        {isSatellite
          ? (lang === "ar" ? "🗺️ خريطة عادية" : "🗺️ Map view")
          : (lang === "ar" ? "🛰️ قمر صناعي" : "🛰️ Satellite")}
      </button>
    </div>
  );
}

export default function CairoMap({ shops, theme, lang, selectedId }: CairoMapProps) {
  const markerRefs = useRef<Record<number, L.Marker | null>>({});
  const [isSatellite, setIsSatellite] = useState(false);

  const openDirections = (shop: MapShop) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          window.open(
            `https://www.google.com/maps/dir/${latitude},${longitude}/${shop.lat},${shop.lng}`,
            "_blank"
          );
        },
        () => {
          window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}&travelmode=driving`,
            "_blank"
          );
        }
      );
    } else {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}&travelmode=driving`,
        "_blank"
      );
    }
  };

  return (
    <>
      <style>{`
        .leaflet-container {
          background: var(--bg-secondary);
          font-family: inherit;
          border-radius: var(--radius-lg);
        }
        .map-dark .leaflet-tile-pane {
          filter: invert(1) hue-rotate(180deg) brightness(0.92) contrast(0.88);
        }
        .map-dark.map-satellite .leaflet-tile-pane { filter: none; }
        .leaflet-popup-content-wrapper {
          background: var(--bg-card) !important;
          color: var(--text-primary) !important;
          border-radius: 14px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,.18) !important;
          border: 1px solid var(--border);
          padding: 0;
          min-width: 200px;
        }
        .leaflet-popup-content { margin: 0; }
        .leaflet-popup-tip-container { display: none; }
        .leaflet-container a.leaflet-popup-close-button {
          color: var(--text-tertiary);
          top: 8px; right: 8px;
          font-size: 16px;
          z-index: 10;
        }
        .leaflet-control-zoom {
          border: 1px solid var(--border) !important;
          border-radius: 10px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: var(--bg-card) !important;
          color: var(--text-primary) !important;
          border-color: var(--border) !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom a:hover {
          background: var(--accent-muted) !important;
          color: var(--accent) !important;
        }
        .leaflet-attribution-flag { display: none !important; }
        .leaflet-control-attribution {
          font-size: 9px !important;
          opacity: 0.5;
        }
      `}</style>

      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <MapContainer
          center={CAIRO_CENTER}
          zoom={11}
          scrollWheelZoom={true}
          zoomControl={true}
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
                <div style={{ fontFamily: "inherit", padding: "14px 16px" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>
                    {shop.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>
                    📍 {shop.area[lang]}
                  </div>
                  <div style={{ fontSize: 12, marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ color: "#F59E0B" }}>★</span>
                    <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{shop.rating}</span>
                    {shop.reviews > 0 && (
                      <span style={{ color: "var(--text-tertiary)" }}>({shop.reviews})</span>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <button
                      onClick={() => openDirections(shop)}
                      style={{
                        width: "100%", padding: "9px 0", borderRadius: 8,
                        background: "linear-gradient(135deg, #E8730A, #C85E0A)",
                        color: "#fff", border: "none",
                        cursor: "pointer", fontSize: 12, fontWeight: 700,
                        fontFamily: "inherit",
                      }}
                    >
                      {lang === "ar" ? "🗺️ احصل على الاتجاهات" : "🗺️ Get directions"}
                    </button>
                    <button
                      onClick={() => window.location.href = `/shop/${shop.id}`}
                      style={{
                        width: "100%", padding: "9px 0", borderRadius: 8,
                        background: "var(--bg-secondary)", color: "var(--text-primary)",
                        border: "1px solid var(--border)",
                        cursor: "pointer", fontSize: 12, fontWeight: 600,
                        fontFamily: "inherit",
                      }}
                    >
                      {lang === "ar" ? "عرض الورشة ←" : "View workshop →"}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          <FlyToSelected shops={shops} selectedId={selectedId} markerRefs={markerRefs} />
        </MapContainer>

        <MapControls isSatellite={isSatellite} onToggle={() => setIsSatellite(v => !v)} lang={lang} />
      </div>
    </>
  );
}
