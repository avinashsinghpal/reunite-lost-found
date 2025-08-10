import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Props = {
  value?: { lng: number; lat: number };
  onChange?: (coords?: { lng: number; lat: number }) => void;
};

const TOKEN_KEY = "mapbox_public_token";

const MapInput: React.FC<Props> = ({ value, onChange }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [token, setToken] = useState<string>(() => localStorage.getItem(TOKEN_KEY) || "");

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: value ? [value.lng, value.lat] : [0, 20],
      zoom: value ? 10 : 1.5,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    const setMarker = (lng: number, lat: number) => {
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current!);
    };

    if (value) setMarker(value.lng, value.lat);

    mapRef.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      setMarker(lng, lat);
      onChange?.({ lng, lat });
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [token]);

  const handleSaveToken = () => {
    localStorage.setItem(TOKEN_KEY, token);
    window.location.reload();
  };

  return (
    <div className="space-y-2">
      {!token ? (
        <div className="rounded-md border p-3 bg-accent/50">
          <p className="text-sm mb-2">
            To pick a location on the map, add your Mapbox public token. You can find it in your Mapbox Dashboard under Tokens.
          </p>
          <div className="flex gap-2">
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="pk.YourMapboxPublicToken"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSaveToken}
              className="h-10 px-4 rounded-md bg-primary text-primary-foreground"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div ref={mapContainer} className="w-full h-64 rounded-md border" />
      )}
    </div>
  );
};

export default MapInput;
