'use client';
import { Link } from '@/navigation';
import { cn } from '@/lib/utils';
import type { Prospect } from '@/types';
import { MapPin, Store, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProspectCardProps {
  prospect: Prospect;
  isSelected: boolean;
  onSelect: () => void;
}

const statusConfig: Record<Prospect['status'], { label: string; className: string; }> = {
  pending: { label: 'Nuevo', className: 'status-new' },
  contacted: { label: 'Contactado', className: 'status-visited' },
  visited: { label: 'Visitado', className: 'status-visited' },
  client: { label: 'Cliente', className: 'status-closed-won' },
  'not_interested': { label: 'No interesado', className: 'status-closed-lost' },
};

export function ProspectCard({ prospect, isSelected, onSelect }: ProspectCardProps) {
  const { name, address, zone, category, status } = prospect;
  const statusInfo = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`prospect-item ${isSelected ? 'selected' : ''}`} onClick={onSelect} data-status={status}>
        <div className="prospect-avatar" style={{ background: isSelected ? 'var(--primary)' : 'var(--status-visited)' }}>
            <Store size={20} />
        </div>
        <div className="prospect-info">
            <div className="prospect-header">
                <div className="prospect-name">{name}</div>
                <Badge className={`status-badge ${statusInfo.className}`}>{statusInfo.label}</Badge>
            </div>
            <div className="prospect-address">
                <MapPin size={12} /> {address}
            </div>
            <div className="prospect-meta">
                <span className="prospect-zone"><i className="fas fa-th"></i> {zone || 'N/A'}</span>
                <span className="prospect-type">{category}</span>
            </div>
        </div>
        <div className="prospect-checkbox">{isSelected && <Check size={16} />}</div>
    </div>
  );
}
