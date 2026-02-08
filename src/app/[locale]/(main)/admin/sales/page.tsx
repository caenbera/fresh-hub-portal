'use client';
import { useState, useMemo, useEffect } from 'react';
import { useProspects } from '@/hooks/use-prospects';
import { useAuth } from '@/context/auth-context';
import { districts } from '@/lib/district-config';

import { SalesHeader } from '@/components/admin/sales/SalesHeader';
import { ZoneSelector } from '@/components/admin/sales/ZoneSelector';
import { TabNavigation } from '@/components/admin/sales/TabNavigation';
import { DistrictsView } from '@/components/admin/sales/DistrictsView';
import { MapView } from '@/components/admin/sales/MapView';
import { ProspectsListView } from '@/components/admin/sales/ProspectsListView';
import { SalesStatsView } from '@/components/admin/sales/SalesStatsView';
import { BottomActions } from '@/components/admin/sales/BottomActions';
import { Loader2 } from 'lucide-react';

export default function SalesPage() {
  const { prospects, loading } = useProspects();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('districts');
  const [selectedZone, setSelectedZone] = useState('CHI');
  const [selectedForRoute, setSelectedForRoute] = useState<string[]>([]); // Array of sub-zone codes

  const filteredProspects = useMemo(() => {
    if (!selectedZone || selectedZone === 'all') return prospects;
    return prospects.filter(p => p.zone?.startsWith(selectedZone));
  }, [prospects, selectedZone]);

  const groupedByDistrict = useMemo(() => {
    return filteredProspects.reduce((acc, prospect) => {
      const districtCode = prospect.zone?.split('-').slice(0, 2).join('-') || 'Uncategorized';
      if (!acc[districtCode]) {
        acc[districtCode] = [];
      }
      acc[districtCode].push(prospect);
      return acc;
    }, {} as Record<string, typeof prospects>);
  }, [filteredProspects]);

  const handleToggleSubZone = (subZoneCode: string) => {
    setSelectedForRoute(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subZoneCode)) {
        newSet.delete(subZoneCode);
      } else {
        newSet.add(subZoneCode);
      }
      return Array.from(newSet);
    });
  };

  const handleAcceptCluster = (subZoneCodes: string[]) => {
    setSelectedForRoute(subZoneCodes);
  };
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const zoneConfigs = [
      { code: 'CHI', label: 'Chicago', icon: 'fas fa-city' },
      { code: 'WI', label: 'Wisconsin', icon: 'fas fa-cheese' },
      { code: 'IN', label: 'Indiana', icon: 'fas fa-flag-usa' },
  ];

  const zoneCounts = zoneConfigs.map(zone => ({
      ...zone,
      count: prospects.filter(p => p.zone?.startsWith(zone.code)).length
  }));

  const totalSelectedProspects = prospects.filter(p => selectedForRoute.includes(p.zone || '')).length;

  return (
    <div className="min-h-screen">
      <SalesHeader user={user} />
      <ZoneSelector 
        zones={zoneCounts} 
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
      />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="view-container">
        <div className={`view ${activeTab === 'districts' ? 'active' : ''}`}>
          <DistrictsView 
            groupedProspects={groupedByDistrict}
            districtConfigs={districts}
            selectedSubZones={selectedForRoute}
            onToggleSubZone={handleToggleSubZone}
            onAcceptCluster={handleAcceptCluster}
          />
        </div>
        <div className={`view ${activeTab === 'map' ? 'active' : ''}`}>
          <MapView 
            prospects={filteredProspects}
            districtConfigs={districts}
            selectedSubZones={selectedForRoute}
            onToggleSubZone={handleToggleSubZone}
          />
        </div>
        <div className={`view ${activeTab === 'list' ? 'active' : ''}`}>
          <ProspectsListView 
            prospects={filteredProspects}
            selectedForRoute={selectedForRoute}
            onToggleSubZone={handleToggleSubZone}
          />
        </div>
        <div className={`view ${activeTab === 'stats' ? 'active' : ''}`}>
          <SalesStatsView />
        </div>
      </main>

      {selectedForRoute.length > 0 && (
        <BottomActions 
            count={totalSelectedProspects} 
            onClear={() => setSelectedForRoute([])}
            onGenerate={() => alert(`Generating route for ${totalSelectedProspects} prospects`)}
        />
      )}
    </div>
  );
}
