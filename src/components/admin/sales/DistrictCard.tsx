'use client';

import { useMemo } from 'react';
import type { Prospect } from '@/types';
import { District } from '@/lib/district-config';
import { Map, Users, Target } from 'lucide-react';

interface DistrictCardProps {
  districtConfig: District;
  prospects: Prospect[];
  selectedSubZones: string[];
  onToggleSubZone: (subZoneCode: string) => void;
}

const getDensityColor = (density: number): string => {
  if (density > 10) return 'high-density';
  if (density > 5) return 'medium-density';
  if (density > 0) return 'low-density';
  return 'empty';
};

const getDistrictHeaderColor = (districtCode: string): string => {
  if (districtCode.includes('PIL')) return 'from-green-600 to-green-800';
  if (districtCode.includes('LV')) return 'from-orange-500 to-orange-700';
  if (districtCode.includes('AP')) return 'from-blue-500 to-blue-700';
  return 'from-gray-600 to-gray-800';
};

export function DistrictCard({ districtConfig, prospects, selectedSubZones, onToggleSubZone }: DistrictCardProps) {
  const density = prospects.length / districtConfig.areaKm2;

  const subZoneProspectCounts = useMemo(() => {
    return prospects.reduce((acc, prospect) => {
      const subZoneCode = prospect.zone || 'unknown';
      acc[subZoneCode] = (acc[subZoneCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [prospects]);

  const potentialValue = useMemo(() => {
    // This is a placeholder calculation
    return prospects.length * 1500;
  }, [prospects]);

  return (
    <div className="district-card">
      <div className={`district-header bg-gradient-to-br ${getDistrictHeaderColor(districtConfig.code)}`}>
        <div className="district-code">{districtConfig.code}</div>
        <div className="district-name">{districtConfig.name}</div>
        <div className="district-stats">
          <div className="district-stat">
            <div className="district-stat-value">{prospects.length}</div>
            <div className="district-stat-label">Prospectos</div>
          </div>
          <div className="district-stat">
            <div className="district-stat-value">{density.toFixed(1)}</div>
            <div className="district-stat-label">Pros/km²</div>
          </div>
          <div className="district-stat">
            <div className="district-stat-value">${(potentialValue / 1000).toFixed(0)}k</div>
            <div className="district-stat-label">Potencial</div>
          </div>
        </div>
      </div>

      <div className="mini-map-container">
        <div className="mini-map-header">
          <div className="mini-map-title">
            <Map size={16} /> Grid de Sub-zonas
          </div>
          <div className="density-legend">
            <span className="flex items-center"><span className="legend-dot bg-green-600"></span>Alta</span>
            <span className="flex items-center"><span className="legend-dot bg-orange-500"></span>Media</span>
            <span className="flex items-center"><span className="legend-dot bg-red-500"></span>Baja</span>
          </div>
        </div>
        
        <div className="mini-map-grid">
          {Object.entries(districtConfig.subZones).map(([subZoneCode, subZoneData]) => {
            const count = subZoneProspectCounts[subZoneCode] || 0;
            const subZoneDensity = count / (districtConfig.areaKm2 / 12);
            const colorClass = getDensityColor(subZoneDensity);
            const isSelected = selectedSubZones.includes(subZoneCode);

            return (
              <div 
                key={subZoneCode}
                className={`grid-cell ${colorClass} ${isSelected ? 'selected' : ''}`} 
                onClick={() => onToggleSubZone(subZoneCode)}
              >
                {colorClass !== 'empty' && <div className="cell-check"><i className="fas fa-check"></i></div>}
                <div className="cell-code">{subZoneCode.split('-').pop()}</div>
                {colorClass !== 'empty' && <div className="cell-count">{count}</div>}
                <div className="cell-label">{subZoneData.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
