// src/components/admin/sales/map-view.tsx
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { Prospect } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Navigation, X, LocateFixed, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Importar dinámicamente para evitar SSR
import dynamic from 'next/dynamic';

// Tipos
interface MapViewProps {
  prospects: Prospect[];
  selectedProspects: string[];
  onToggleSelection: (id: string) => void;
  onCreateRoute: () => void;
  activeTab: string;
}

const STATUS_COLORS = {
  pending: '#f59e0b',
  contacted: '#3b82f6',
  visited: '#22c55e',
  client: '#a855f7',
  not_interested: '#6b7280',
};

// Coordenadas base por distrito
const DISTRICT_CENTERS: Record<string, [number, number]> = {
  'CHI-PIL': [41.8559, -87.6659],
  'CHI-LV': [41.8445, -87.7059],
  'CHI-AP': [41.9683, -87.7289],
  'CHI-LP': [41.9296, -87.7078],
  'CHI-IP': [41.9539, -87.7359],
  'CHI-WN': [42.0006, -87.6944],
};

// Componente del mapa cargado dinámicamente
const MapComponent = dynamic(
  () => import('./map-component').then((mod) => mod.MapComponent),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-green-600 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Cargando mapa...</p>
        </div>
      </div>
    )
  }
);

export function MapView({ 
  prospects, 
  selectedProspects, 
  onToggleSelection,
  onCreateRoute,
  activeTab,
}: MapViewProps) {
  const t = useTranslations('AdminSalesPage');
  const [selectedClient, setSelectedClient] = useState<Prospect | null>(null);

  // Preparar datos con coordenadas
  const prospectsWithCoords = useMemo(() => {
    return prospects.map((p, index) => {
      const districtCode = p.zone?.split('-').slice(0, 2).join('-') || 'CHI-PIL';
      const baseCoords = DISTRICT_CENTERS[districtCode] || [41.8781, -87.6298];
      
      // Variación determinística para evitar superposición
      const angle = (index * 137.5) * (Math.PI / 180);
      const radius = 0.003 + (index % 5) * 0.001;
      const lat = baseCoords[0] + Math.cos(angle) * radius;
      const lng = baseCoords[1] + Math.sin(angle) * radius;
      
      return { ...p, lat, lng };
    });
  }, [prospects]);

  const handleMarkerClick = useCallback((prospect: Prospect) => {
    setSelectedClient(prospect);
  }, []);

  return (
    <div className="relative h-[calc(100vh-280px)] min-h-[500px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-start pointer-events-none">
        <div className="flex gap-2 pointer-events-auto flex-wrap">
          <Badge variant="secondary" className="bg-white shadow-md px-3 py-1.5 text-sm border">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-green-600" />
            {prospects.length} prospectos
          </Badge>
          {selectedProspects.length > 0 && (
            <Badge className="bg-green-600 text-white shadow-md px-3 py-1.5 text-sm">
              <Navigation className="h-3.5 w-3.5 mr-1.5" />
              {selectedProspects.length} en ruta
            </Badge>
          )}
        </div>
      </div>

      {/* Mapa */}
      <MapComponent 
        prospects={prospectsWithCoords}
        selectedProspects={selectedProspects}
        onToggleSelection={onToggleSelection}
        onMarkerClick={handleMarkerClick}
        activeTab={activeTab}
      />

      {/* Panel de cliente seleccionado */}
      {selectedClient && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-white rounded-xl shadow-2xl p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 pr-2">
                <h3 className="font-bold text-lg text-gray-900 leading-tight">
                  {selectedClient.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {selectedClient.address}
                </p>
              </div>
              <button 
                onClick={() => setSelectedClient(null)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge 
                variant="outline" 
                className="font-mono text-green-700 bg-green-50 border-green-200 px-2.5 py-1"
              >
                {selectedClient.zone || 'SIN-ZONA'}
              </Badge>
              <Badge variant="secondary" className="capitalize px-2.5 py-1">
                {selectedClient.ethnic}
              </Badge>
              <Badge variant="secondary" className="capitalize px-2.5 py-1">
                {selectedClient.category}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                className={cn(
                  "flex-1 h-11 font-semibold",
                  selectedProspects.includes(selectedClient.id)
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                )}
                onClick={() => onToggleSelection(selectedClient.id)}
              >
                {selectedProspects.includes(selectedClient.id) ? (
                  <>Quitar de ruta</>
                ) : (
                  <>Agregar a ruta</>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="h-11 px-4"
                onClick={() => window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedClient.address)}`, 
                  '_blank'
                )}
              >
                <Navigation className="h-4 w-4 mr-1.5" />
                Ir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur rounded-xl shadow-lg p-4 hidden md:block border border-gray-200">
        <div className="text-sm font-bold text-gray-800 mb-3">Estados</div>
        <div className="space-y-2">
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-3 text-sm">
              <div 
                className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white" 
                style={{ backgroundColor: color }}
              />
              <span className="capitalize text-gray-600 font-medium">
                {t(`status_${status}`)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2 font-semibold">Categorías</div>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">🍽️ Restaurante</div>
            <div className="flex items-center gap-2">🏪 Supermercado</div>
            <div className="flex items-center gap-2">🥩 Carnicería</div>
            <div className="flex items-center gap-2">📍 Otro</div>
          </div>
        </div>
      </div>
    </div>
  );
}
