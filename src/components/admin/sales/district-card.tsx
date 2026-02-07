// src/components/admin/sales/district-card.tsx
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Prospect } from '@/types';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { MapPin, Users, Grid3X3 } from 'lucide-react';

interface DistrictCardProps {
  districtCode: string;
  districtName: string;
  prospects: Prospect[];
  onEdit: (prospect: Prospect) => void;
  onCheckIn: (prospect: Prospect) => void;
  isSelectionMode: boolean;
  selectedProspects: string[];
  onSelectionChange: (prospectId: string, isSelected: boolean) => void;
  onSelectAll: (prospectIds: string[], select: boolean) => void;
}

export function DistrictCard({
  districtCode,
  districtName,
  prospects,
  onEdit,
  onCheckIn,
  isSelectionMode,
  selectedProspects,
  onSelectionChange,
  onSelectAll,
}: DistrictCardProps) {
  const t = useTranslations('AdminSalesPage');

  const subZones = useMemo(() => {
    return prospects.reduce((acc, prospect) => {
      const subZoneCode = prospect.zone || 'Uncategorized';
      if (!acc[subZoneCode]) {
        const subZoneName = subZoneCode.includes('-') 
          ? `Sub-zona ${subZoneCode.split('-').pop()}` 
          : 'General';
        acc[subZoneCode] = { code: subZoneCode, name: subZoneName, prospects: [] };
      }
      acc[subZoneCode].prospects.push(prospect);
      return acc;
    }, {} as Record<string, { code: string; name: string; prospects: Prospect[] }>);
  }, [prospects]);

  const totalProspects = prospects.length;
  
  // Generar grid de 12 celdas para el mini-mapa
  const miniMapGridCells = useMemo(() => {
    const cells = Array(12).fill(null);
    const subZoneEntries = Object.values(subZones).slice(0, 12);
    subZoneEntries.forEach((sz, index) => {
      const prospectIds = sz.prospects.map(p => p.id);
      const selectedCount = prospectIds.filter(id => selectedProspects.includes(id)).length;
      const totalCount = prospectIds.length;
      
      cells[index] = {
        code: sz.code.split('-').pop() || '??',
        hasClients: true,
        selected: selectedCount === totalCount && totalCount > 0,
        partial: selectedCount > 0 && selectedCount < totalCount,
        count: sz.prospects.length
      };
    });
    return cells;
  }, [subZones, selectedProspects]);

  const handleSelectAll = () => {
    const allIds = prospects.map(p => p.id);
    const allSelected = allIds.every(id => selectedProspects.includes(id));
    onSelectAll(allIds, !allSelected);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      {/* Header con gradiente */}
      <CardHeader className={cn(
        "p-4 text-white",
        districtCode.includes('PIL') ? "bg-gradient-to-r from-green-600 to-green-700" :
        districtCode.includes('LV') ? "bg-gradient-to-r from-blue-600 to-blue-700" :
        districtCode.includes('AP') ? "bg-gradient-to-r from-orange-500 to-orange-600" :
        "bg-gradient-to-r from-gray-600 to-gray-700"
      )}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-5 w-5 opacity-80" />
              <CardTitle className="font-mono text-2xl font-bold tracking-wider">
                {districtCode}
              </CardTitle>
            </div>
            <CardDescription className="text-white/90 font-medium text-base">
              {districtName}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{totalProspects}</div>
            <div className="text-xs opacity-80 uppercase tracking-wide">
              {t('district_prospects', { count: totalProspects })}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Mini Map Grid */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Grid3X3 className="h-4 w-4" />
              Distribución de Sub-zonas
            </div>
            {isSelectionMode && (
              <button 
                onClick={handleSelectAll}
                className="text-xs text-green-600 font-medium hover:underline"
              >
                Seleccionar todo
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-4 grid-rows-3 gap-2 h-32">
            {miniMapGridCells.map((cell, index) => (
              <div 
                key={index} 
                className={cn(
                  "rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all",
                  !cell && "bg-gray-200 text-gray-400",
                  cell?.hasClients && !cell?.selected && !cell?.partial && "bg-green-100 text-green-700 hover:bg-green-200",
                  cell?.partial && "bg-amber-100 text-amber-700 border-2 border-amber-400",
                  cell?.selected && "bg-green-600 text-white shadow-md"
                )}
              >
                {cell && (
                  <>
                    <span className="text-lg">{cell.code}</span>
                    <span className={cn(
                      "text-[10px] font-normal",
                      cell.selected ? "text-green-100" : "text-green-600"
                    )}>
                      {cell.count}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sub-zones List */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(subZones).map(([code, { name, prospects: subZoneProspects }]) => {
            const prospectIds = subZoneProspects.map(p => p.id);
            const selectedCount = prospectIds.filter(id => selectedProspects.includes(id)).length;
            const totalCount = prospectIds.length;
            const isFullySelected = selectedCount === totalCount;
            const isPartiallySelected = selectedCount > 0 && !isFullySelected;

            return (
              <button 
                key={code}
                onClick={() => onSelectAll(prospectIds, !isFullySelected)}
                className={cn(
                  "p-3 rounded-xl text-left transition-all border-2 relative overflow-hidden",
                  isFullySelected 
                    ? 'bg-green-50 border-green-500 shadow-sm' 
                    : isPartiallySelected
                      ? 'bg-amber-50 border-amber-400'
                      : 'bg-gray-50 border-transparent hover:border-green-200 hover:bg-green-50/50'
                )}
              >
                {/* Indicador de selección */}
                {(isFullySelected || isPartiallySelected) && (
                  <div className={cn(
                    "absolute top-2 right-2 w-2 h-2 rounded-full",
                    isFullySelected ? "bg-green-500" : "bg-amber-400"
                  )} />
                )}
                
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-green-700">
                    {code}
                  </span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-bold",
                    isFullySelected 
                      ? "bg-green-500 text-white" 
                      : "bg-green-100 text-green-700"
                  )}>
                    {subZoneProspects.length}
                  </span>
                </div>
                <div className="text-xs text-gray-600 truncate">{name}</div>
                
                {isPartiallySelected && (
                  <div className="text-[10px] text-amber-600 mt-1 font-medium">
                    {selectedCount} de {totalCount} seleccionados
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Lista de prospectos en esta zona */}
        <div className="space-y-3 pt-2">
          {prospects.map(prospect => (
            <ProspectCard
              key={prospect.id}
              prospect={prospect}
              onEdit={onEdit}
              onCheckIn={onCheckIn}
              isSelectionMode={isSelectionMode}
              isSelected={selectedProspects.includes(prospect.id)}
              onSelectionChange={onSelectionChange}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}