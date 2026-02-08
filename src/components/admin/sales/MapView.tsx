'use client';
import { useMemo, useState } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, Circle } from '@react-google-maps/api';
import type { Prospect } from '@/types';
import type { District } from '@/lib/district-config';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Trash, Wand } from 'lucide-react';

interface MapViewProps {
  prospects: Prospect[];
  districtConfigs: Record<string, District>;
  selectedSubZones: string[];
  onToggleSubZone: (subZoneCode: string) => void;
}

export function MapView({ prospects, districtConfigs, selectedSubZones, onToggleSubZone }: MapViewProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const containerStyle = {
    width: '100%',
    height: 'calc(100vh - 200px)',
    borderRadius: '16px'
  };

  const center = {
    lat: 41.8550,
    lng: -87.6800
  };

  const mapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    }
  };

  const districtPolygons = useMemo(() => {
    return Object.entries(districtConfigs).map(([code, config]) => {
      const paths = config.boundaries.map(coord => ({ lat: coord[1], lng: coord[0] }));
      return (
        <Polygon
          key={code}
          paths={paths}
          options={{
            strokeColor: '#2E7D32',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#4CAF50',
            fillOpacity: 0.1,
          }}
        />
      );
    });
  }, [districtConfigs]);
  
  if (!isLoaded) {
    return <div className="flex h-96 w-full items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        options={mapOptions}
        onLoad={mapInstance => setMap(mapInstance)}
      >
        {districtPolygons}
      </GoogleMap>
      <div className="map-overlay">
        <h3 className="font-bold mb-2 text-sm">Vista de Polígonos</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Rectángulos = distritos | Círculos = sub-zonas seleccionadas
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" onClick={() => onToggleSubZone('')}>
            <Trash className="mr-2 h-4 w-4" /> Limpiar
          </Button>
          <Button size="sm">
            <Wand className="mr-2 h-4 w-4" /> Optimizar
          </Button>
        </div>
      </div>
    </div>
  );
}
