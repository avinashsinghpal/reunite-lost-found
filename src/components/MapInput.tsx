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
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showMapSetup, setShowMapSetup] = useState(false);

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
    setShowMapSetup(false);
    window.location.reload();
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };
        onChange?.(coords);
        setIsGettingLocation(false);
        
        // If we have a map, center it on the user's location
        if (mapRef.current) {
          mapRef.current.setCenter([longitude, latitude]);
          mapRef.current.setZoom(12);
          setMarker(longitude, latitude);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access was denied. Please allow location access in your browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred while getting location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="space-y-2">
      {/* Geolocation Section - Always Visible */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="h-10 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGettingLocation ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Getting location...
            </>
          ) : (
            <>
              📍 Get Current Location
            </>
          )}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange?.(undefined)}
            className="h-10 px-4 rounded-md bg-gray-600 text-white hover:bg-gray-700"
          >
            Clear Location
          </button>
        )}
      </div>
      
      {locationError && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{locationError}</p>
      )}

      {/* Map Section - Optional */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Interactive Map (Optional)</label>
          {!token && (
            <button
              type="button"
              onClick={() => setShowMapSetup(!showMapSetup)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {showMapSetup ? "Hide" : "Show"} Map Setup
            </button>
          )}
        </div>

        {showMapSetup && !token && (
          <div className="rounded-md border p-3 bg-accent/50">
            <p className="text-sm mb-2">
              To enable the interactive map, add your Mapbox public token. You can find it in your Mapbox Dashboard under Tokens.
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
        )}

        {token && (
          <div ref={mapContainer} className="w-full h-64 rounded-md border" />
        )}
      </div>
    </div>
  );
};

export default MapInput;
