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
    const scale = isSelected ? 1.4 : 1.2;

    // Simplified SVG paths for icons, designed for a 14x14 viewbox
    let iconPath = 'M7 1a6 6 0 0 0 0 12c3.314 0 6-2.686 6-6a6 6 0 0 0-6-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z'; // Default: MapPin circle
    switch (prospect.category.toLowerCase()) {
        case 'restaurante':
            iconPath = "M6 2v10m4-10v10M2 7h10"; // Simplified Utensils
            break;
        case 'supermercado':
            iconPath = "M1 4h12M1 7h12M2 4l1 8h8l1-8"; // Simplified Store
            break;
        case 'carnicería':
            iconPath = "M11.58 1.44a1 1 0 0 0-1.55.29L4 11.5h1.5l1-2h5l1 2h1.5L8.42 1.73a1 1 0 0 0-1.55-.29zM6.5 7.5l2-4 2 4h-4z"; // Simplified Beef/Meat
            break;
    }
    
    // Using Data URI to create a fully custom SVG icon
    const svg = `
        <svg width="${28 * scale}" height="${40 * scale}" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="${color}" stroke="white" stroke-width="1.5"/>
            <g transform="translate(7 7) scale(0.6)">
                <path d="${iconPath}" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
        </svg>`;

    return {
        url: `data:image/svg+xml;base64,${btoa(svg)}`,
        anchor: new google.maps.Point(14 * scale, 40 * scale),
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
