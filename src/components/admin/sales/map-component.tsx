// src/components/admin/sales/map-component.tsx
'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Prospect } from '@/types';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  prospects: (Prospect & { lat: number; lng: number })[];
  selectedProspects: string[];
  onToggleSelection: (id: string) => void;
  onMarkerClick: (prospect: Prospect) => void;
  activeTab: string;
}


// Icono personalizado
const createCustomIcon = (isSelected: boolean, status: string, category: string) => {
  const color = {
    pending: '#f59e0b',
    contacted: '#3b82f6',
    visited: '#22c55e',
    client: '#a855f7',
    not_interested: '#6b7280',
  }[status] || '#6b7280';

  const emoji = {
    'Restaurante': '🍽️',
    'Supermercado': '🏪',
    'Carnicería': '🥩',
    'Otro': '📍',
  }[category] || '📍';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${isSelected ? '#ea580c' : color};
        width: ${isSelected ? '48px' : '40px'};
        height: ${isSelected ? '48px' : '40px'};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-size: 18px;
        transition: all 0.2s ease;
        animation: ${isSelected ? 'bounce 0.5s' : 'none'};
      ">
        <span style="transform: rotate(45deg);">${emoji}</span>
      </div>
    `,
    iconSize: [isSelected ? 48 : 40, isSelected ? 48 : 40],
    iconAnchor: [isSelected ? 24 : 20, isSelected ? 48 : 40],
    popupAnchor: [0, -36],
  });
};


// Este componente se encarga de toda la lógica dinámica DENTRO del mapa
function MapController({ prospects, selectedProspects, onToggleSelection, onMarkerClick, activeTab }: MapComponentProps) {
  const map = useMap();

  // Efecto para redimensionar el mapa cuando la pestaña se activa
  useEffect(() => {
    if (activeTab === 'map') {
      const timer = setTimeout(() => {
        try {
          map.invalidateSize();
        } catch (e) {
          console.error("Could not invalidate map size:", e);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, map]);

  // Efecto para ajustar la vista a los marcadores cuando los prospectos cambian
  useEffect(() => {
    if (prospects.length > 0) {
        try {
            const bounds = L.latLngBounds(prospects.map(p => [p.lat, p.lng]));
            if(bounds.isValid()) {
                map.fitBounds(bounds.pad(0.1));
            }
        } catch (e) {
          console.error("Could not fit map bounds:", e);
        }
    }
  }, [prospects, map]);

  // Renderiza los marcadores
  return (
    <>
      {prospects.map((prospect) => {
        const isSelected = selectedProspects.includes(prospect.id);
        return (
          <Marker
            key={prospect.id}
            position={[prospect.lat, prospect.lng]}
            icon={createCustomIcon(isSelected, prospect.status, prospect.category)}
            eventHandlers={{ click: () => onMarkerClick(prospect) }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-base mb-1 text-gray-900">
                  {prospect.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 leading-snug">
                  {prospect.address}
                </p>
                <div className="font-mono text-sm font-bold text-green-700 bg-green-50 inline-block px-2 py-1 rounded mb-2">
                  {prospect.zone || 'SIN-ZONA'}
                </div>
                <div className="flex gap-1 mb-3">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                    {prospect.ethnic}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {prospect.category}
                  </span>
                </div>
                <button
                  onClick={() => onToggleSelection(prospect.id)}
                  className={`w-full py-2 px-3 rounded font-semibold text-sm transition-colors ${
                    isSelected 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isSelected ? 'Quitar de ruta' : 'Agregar a ruta'}
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

// El componente principal ahora solo renderiza el contenedor del mapa estático
export function MapComponent(props: MapComponentProps) {
  const center: [number, number] = [41.8781, -87.6298]; // Default Chicago center

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{y}.png"
        maxZoom={19}
      />
      {/* El controlador se encarga de todo lo dinámico */}
      <MapController {...props} />
    </MapContainer>
  );
}
