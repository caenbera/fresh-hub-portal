'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Prospect } from '@/types';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface DistrictCardProps {
  districtCode: string;
  districtName: string;
  prospects: Prospect[];
  onBulkSelect: (prospectIds: string[], select: boolean) => void;
  selectedProspects: string[];
}

export function DistrictCard({
  districtCode,
  districtName,
  prospects,
  onBulkSelect,
  selectedProspects,
}: DistrictCardProps) {
  const t = useTranslations('AdminSalesPage');

  const subZones = useMemo(() => {
    return prospects.reduce((acc, prospect) => {
      const subZoneCode = prospect.zone || 'Uncategorized';
      if (!acc[subZoneCode]) {
        // A better name would come from a data source, but this is a good fallback.
        const subZoneName = subZoneCode.includes('-') ? `Sub-zona ${subZoneCode.split('-').pop()}` : 'General';
        acc[subZoneCode] = { code: subZoneCode, name: subZoneName, prospects: [] };
      }
      acc[subZoneCode].prospects.push(prospect);
      return acc;
    }, {} as Record<string, { code: string; name: string; prospects: Prospect[] }>);
  }, [prospects]);

  const handleSubZoneClick = (subZoneProspects: Prospect[]) => {
    const prospectIds = subZoneProspects.map(p => p.id);
    const areAllSelected = prospectIds.length > 0 && prospectIds.every(id => selectedProspects.includes(id));
    onBulkSelect(prospectIds, !areAllSelected);
  };
  
  const totalProspects = prospects.length;
  
  const miniMapGridCells = useMemo(() => {
    const cells = Array(12).fill(null);
    const subZoneEntries = Object.values(subZones);
    subZoneEntries.forEach((sz, index) => {
      if (index < cells.length) {
        const prospectIds = sz.prospects.map(p => p.id);
        const areAllSelected = prospectIds.length > 0 && prospectIds.every(id => selectedProspects.includes(id));
        cells[index] = {
          code: sz.code.split('-').pop() || '??',
          hasClients: true,
          selected: areAllSelected
        };
      }
    });
    return cells;
  }, [subZones, selectedProspects]);

  return (
    <Card className="shadow-lg border-l-4 border-primary overflow-hidden">
        <CardHeader className="bg-primary/10 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="font-mono text-xl md:text-2xl text-primary">{districtCode}</CardTitle>
                    <CardDescription className="font-semibold text-sm md:text-base">{districtName}</CardDescription>
                </div>
                <div className="text-right">
                     <div className="text-xl md:text-2xl font-bold">{totalProspects}</div>
                     <div className="text-xs text-muted-foreground">{t('district_prospects', { count: totalProspects })}</div>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
            <div className="h-28 bg-muted rounded-lg p-2 border">
                <div className="grid grid-cols-4 grid-rows-3 gap-1 h-full w-full">
                    {miniMapGridCells.map((cell, index) => (
                        <div key={index} className={cn(
                            "rounded flex items-center justify-center text-xs font-bold",
                            cell ? (cell.selected ? "bg-accent text-accent-foreground animate-pulse" : "bg-primary/20 text-primary") : "bg-muted-foreground/10"
                        )}>
                            {cell?.code}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(subZones).map(([code, { name, prospects: subZoneProspects }]) => {
                    const prospectIds = subZoneProspects.map(p => p.id);
                    const areAllInSubZoneSelected = prospectIds.length > 0 && prospectIds.every(id => selectedProspects.includes(id));

                    return (
                        <button 
                            key={code}
                            onClick={() => handleSubZoneClick(subZoneProspects)}
                            className={cn(
                                "p-2 rounded-lg text-left transition-all border-2",
                                areAllInSubZoneSelected ? 'bg-primary/10 border-primary' : 'bg-muted/60 border-transparent hover:bg-primary/5'
                            )}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-xs font-bold text-primary">{code}</span>
                                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", areAllInSubZoneSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary')}>
                                    {subZoneProspects.length}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 truncate">{name}</div>
                        </button>
                    );
                })}
            </div>
        </CardContent>
    </Card>
  );
}
