'use client';
import { useState } from 'react';
import { ProspectCard } from './ProspectCard';
import type { Prospect } from '@/types';

interface ProspectsListViewProps {
  prospects: Prospect[];
  selectedForRoute: string[];
  onToggleSubZone: (subZoneCode: string) => void;
}

const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'pending', label: 'Nuevos' },
    { id: 'visited', label: 'Visitados' },
    { id: 'client', label: 'Clientes' },
];

export function ProspectsListView({ prospects, selectedForRoute, onToggleSubZone }: ProspectsListViewProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProspects = prospects.filter(p => {
    if (activeFilter === 'all') return true;
    return p.status === activeFilter;
  });

  return (
    <div>
      <div className="filter-bar">
        {filters.map(filter => (
          <div 
            key={filter.id}
            className={`filter-chip ${activeFilter === filter.id ? 'active' : ''}`} 
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </div>
        ))}
      </div>

      <div className="prospect-list">
        {filteredProspects.map(prospect => (
          <ProspectCard 
            key={prospect.id}
            prospect={prospect}
            isSelected={selectedForRoute.includes(prospect.zone || '')}
            onSelect={() => onToggleSubZone(prospect.zone || '')}
          />
        ))}
      </div>
    </div>
  );
}
