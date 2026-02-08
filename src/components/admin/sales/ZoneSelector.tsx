'use client';
import { City, Cheese, Flag } from 'lucide-react';

interface ZoneSelectorProps {
  zones: { code: string; label: string; icon: string; count: number }[];
  selectedZone: string;
  onSelectZone: (zoneCode: string) => void;
}

export function ZoneSelector({ zones, selectedZone, onSelectZone }: ZoneSelectorProps) {
  const getIcon = (iconName: string) => {
    switch(iconName) {
        case 'fas fa-city': return <City size={14} />;
        case 'fas fa-cheese': return <Cheese size={14} />;
        case 'fas fa-flag-usa': return <Flag size={14} />;
        default: return <City size={14} />;
    }
  }

  return (
    <div className="zone-bar">
      <div className="zone-chips">
        {zones.map(zone => (
          <div 
            key={zone.code}
            className={`zone-chip ${selectedZone === zone.code ? 'active' : ''}`} 
            onClick={() => onSelectZone(zone.code)}
          >
            {getIcon(zone.icon)}
            {zone.label}
            <span className="count">{zone.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
