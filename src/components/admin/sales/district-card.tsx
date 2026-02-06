'use client';

import { ProspectCard } from './prospect-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { Prospect } from '@/types';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

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

  const allProspectIdsInDistrict = prospects.map(p => p.id);
  const areAllSelected = allProspectIdsInDistrict.length > 0 && allProspectIdsInDistrict.every(id => selectedProspects.includes(id));

  const subZones = useMemo(() => {
    return prospects.reduce((acc, prospect) => {
        const subZoneCode = prospect.zone;
        if (!subZoneCode) return acc;
        if (!acc[subZoneCode]) {
            acc[subZoneCode] = { code: subZoneCode, count: 0, prospectIds: [] };
        }
        acc[subZoneCode].count++;
        acc[subZoneCode].prospectIds.push(prospect.id);
        return acc;
    }, {} as Record<string, { code: string; count: number; prospectIds: string[] }>);
  }, [prospects]);

  const handleSelectAllInDistrict = () => {
    onSelectAll(allProspectIdsInDistrict, !areAllSelected);
  };

  const handleSubZoneClick = (subZoneProspectIds: string[]) => {
    if (!isSelectionMode) return;
    const areAllInSubZoneSelected = subZoneProspectIds.every(id => selectedProspects.includes(id));
    onSelectAll(subZoneProspectIds, !areAllInSubZoneSelected);
  }

  return (
    <Card className="shadow-lg border-l-4 border-primary">
      <CardHeader className="flex flex-row items-center justify-between bg-primary/5 p-4">
        <div>
          <CardTitle className="text-lg">{districtName}</CardTitle>
          <CardDescription>{t('district_prospects', { count: prospects.length })}</CardDescription>
        </div>
        {isSelectionMode && (
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/10">
            <Checkbox
              id={`select-all-${districtCode}`}
              checked={areAllSelected}
              onCheckedChange={handleSelectAllInDistrict}
              className="h-5 w-5"
            />
            <label htmlFor={`select-all-${districtCode}`} className="text-sm font-medium cursor-pointer">{t('select_all')}</label>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.values(subZones).map(subZone => {
                const isSubZoneSelected = subZone.prospectIds.every(id => selectedProspects.includes(id));
                return (
                    <button 
                        key={subZone.code} 
                        className={`p-2 rounded-lg text-left transition-all disabled:cursor-not-allowed ${isSubZoneSelected ? 'bg-primary/10 border-primary border' : 'bg-muted/60 border-transparent border'} ${isSelectionMode ? 'hover:bg-primary/10' : ''}`}
                        onClick={() => handleSubZoneClick(subZone.prospectIds)}
                        disabled={!isSelectionMode}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-xs font-bold text-primary">{subZone.code}</span>
                            <span className="text-xs bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full">{subZone.count}</span>
                        </div>
                    </button>
                )
            })}
        </div>
        
        <div className="space-y-3">
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
