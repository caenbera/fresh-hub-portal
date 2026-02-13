'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { Prospect } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, X, Loader2 } from 'lucide-react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, Polygon } from '@react-google-maps/api';
import { districts } from '@/lib/district-config';

interface MapViewProps {
  prospects: Prospect[];
  selectedProspects: string[];
  onToggleSelection: (id: string) => void;
}

// This interface is for prospects that are guaranteed to have coordinates
interface ProspectWithCoords extends Prospect {
  lat: number;
  lng: number;
}

// New high-contrast color palette
const STATUS_COLORS: Record<Prospect['status'], string> = {
  pending: '#f97316', // Orange-500 (Vibrant Orange)
  contacted: '#06b6d4', // Cyan-500 (Vibrant Turquoise)
  visited: '#d946ef', // Fuchsia-500 (Vibrant Magenta)
  client: '#8b5cf6', // Violet-500 (Vibrant Purple)
  not_interested: '#6b7280', // Gray-500 (Kept as is)
};

const DISTRICT_CENTERS: Record<string, [number, number]> = {
  'CHI-PIL': [41.8559, -87.6659],
  'CHI-LV': [41.8445, -87.7059],
  'CHI-AP': [41.9683, -87.7289],
  'CHI-LP': [41.9296, -87.7078],
  'CHI-IP': [41.9539, -87.7359],
  'WI-MKE': [43.0389, -87.9065],
  'IN-IN': [39.7684, -86.1581],
};

export function MapView({ prospects, selectedProspects, onToggleSelection }: MapViewProps) {
  const t = useTranslations('AdminSalesPage');
  const [selectedProspect, setSelectedProspect] = useState<ProspectWithCoords | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const prospectsWithCoords: ProspectWithCoords[] = useMemo(() => {
    const districtCoordsCount: Record<string, number> = {};
    
    return prospects.map((p) => {
      if (p.lat && p.lng) {
        return { ...p, lat: p.lat, lng: p.lng };
      }
      
      const districtCode = p.zone?.split('-').slice(0, 2).join('-') || 'CHI-PIL';
      const baseCoords = DISTRICT_CENTERS[districtCode] || [41.8781, -87.6298];
      
      const index = districtCoordsCount[districtCode] || 0;
      districtCoordsCount[districtCode] = index + 1;
      
      const angle = (index * 137.5) * (Math.PI / 180);
      const radius = 0.003 + (index % 5) * 0.001;
      const lat = baseCoords[0] + Math.cos(angle) * radius;
      const lng = baseCoords[1] + Math.sin(angle) * radius;
      
      return { ...p, lat, lng };
    }).filter((p): p is ProspectWithCoords => p !== null);
  }, [prospects]);

  const mapCenter = useMemo(() => {
    if (prospectsWithCoords.length === 0) {
      return { lat: 41.8781, lng: -87.6298 }; // Chicago center
    }
    const avgLat = prospectsWithCoords.reduce((sum, p) => sum + p.lat, 0) / prospectsWithCoords.length;
    const avgLng = prospectsWithCoords.reduce((sum, p) => sum + p.lng, 0) / prospectsWithCoords.length;
    return { lat: avgLat, lng: avgLng };
  }, [prospectsWithCoords]);

  const districtPolygons = useMemo(() => {
    return Object.values(districts).map((district) => {
        const paths = district.boundaries.map(coord => ({ lat: coord[1], lng: coord[0] }));
        return (
            <Polygon
                key={district.code}
                paths={paths}
                options={{
                    strokeColor: '#4A5568', // A neutral dark gray
                    strokeOpacity: 0.6,
                    strokeWeight: 1.5,
                    fillColor: '#718096', // A neutral gray
                    fillOpacity: 0.1,
                    clickable: false,
                }}
            />
        );
    });
  }, []);

  const handleMarkerClick = useCallback((prospect: ProspectWithCoords) => {
    setSelectedProspect(prospect);
  }, []);

  const getMarkerIcon = useCallback((prospect: Prospect, isSelected: boolean): google.maps.Icon | undefined => {
    if (!isLoaded) return undefined;
    const color = STATUS_COLORS[prospect.status] || '#6b7280';
    // Increased scale for better visibility
    const scale = isSelected ? 2.2 : 1.5;
    const pinPath = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5-2.5-1.12 2.5-2.5-2.5z";

    return {
      path: pinPath,
      fillColor: color,
      fillOpacity: isSelected ? 1 : 0.9,
      strokeWeight: 1.5,
      strokeColor: '#ffffff',
      scale: scale,
      anchor: new google.maps.Point(12, 24),
    };
  }, [isLoaded]);

  if (!isLoaded) {
    return (
        <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center bg-gray-50 rounded-xl">
            <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">Cargando mapa...</p>
            </div>
        </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 240px)', minHeight: '600px' }} className="relative rounded-xl overflow-hidden border">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={12}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {districtPolygons}
        {prospectsWithCoords.map(prospect => (
          <MarkerF
            key={prospect.id}
            position={{ lat: prospect.lat, lng: prospect.lng }}
            onClick={() => handleMarkerClick(prospect)}
            icon={getMarkerIcon(prospect, selectedProspects.includes(prospect.id))}
            zIndex={selectedProspects.includes(prospect.id) ? 100 : 1}
          />
        ))}

        {selectedProspect && (
          <InfoWindowF
            position={{ lat: selectedProspect.lat, lng: selectedProspect.lng }}
            onCloseClick={() => setSelectedProspect(null)}
            options={{ pixelOffset: new google.maps.Size(0, -40) }}
          >
            <div className="p-1 max-w-xs">
              <h3 className="font-bold text-base">{selectedProspect.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedProspect.address}</p>
              <Badge variant="outline" className="mt-2 capitalize">{t(`status_${selectedProspect.status}`)}</Badge>
              <Button
                size="sm"
                className="w-full mt-3"
                onClick={() => onToggleSelection(selectedProspect.id)}
              >
                {selectedProspects.includes(selectedProspect.id) ? 'Quitar de Ruta' : 'Agregar a Ruta'}
              </Button>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}
