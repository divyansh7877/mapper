"use client";

import { useEffect, useState } from "react";
import { Map, MapControls, MapMarker, MarkerPopup, useMap } from "@/components/ui/map";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LocationPickerProps {
  center?: [number, number];
  zoom?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  className?: string;
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: maplibregl.MapLayerMouseEvent) => {
      onMapClick(e.lngLat.lat, e.lngLat.lng);
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

export function LocationPicker({
  center = [-74.006, 40.7128],
  zoom = 13,
  onLocationSelect,
  className,
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState(center);

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation([lng, lat]);
    onLocationSelect(lat, lng);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setMapCenter(newCenter);
          setSelectedLocation(newCenter);
          onLocationSelect(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Geolocation failed, keep default
        }
      );
    }
  };

  return (
    <Card className={`overflow-hidden ${className || ""}`}>
      <div className="p-2 border-b flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Click on map to select location
        </span>
        <Button variant="outline" size="sm" onClick={handleUseCurrentLocation}>
          Use My Location
        </Button>
      </div>
      <div className="h-[250px] relative">
        <Map center={mapCenter} zoom={zoom} className="h-full w-full">
          <MapControls />
          <MapClickHandler onMapClick={handleMapClick} />
          {selectedLocation && (
            <MapMarker
              longitude={selectedLocation[0]}
              latitude={selectedLocation[1]}
              draggable
              onDragEnd={(e) => {
                setSelectedLocation([e.lng, e.lat]);
                onLocationSelect(e.lat, e.lng);
              }}
            >
              <MarkerPopup>
                <div className="p-2">
                  <span className="text-sm">Selected Location</span>
                </div>
              </MarkerPopup>
            </MapMarker>
          )}
        </Map>
      </div>
    </Card>
  );
}
