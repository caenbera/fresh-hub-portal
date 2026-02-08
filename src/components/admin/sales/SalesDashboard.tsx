'use client';
import { Trophy, Compass, Handshake, DollarSign } from 'lucide-react';

export function SalesDashboard() {
  return (
    <div className="sales-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <Trophy size={16} className="inline mr-1" /> Tu Rendimiento Hoy
        </div>
        <div className="dashboard-date">08 Feb 2026</div>
      </div>
      <div className="metrics-grid">
        <div className="metric-box">
          <div className="metric-value">8</div>
          <div className="metric-label">Visitas</div>
        </div>
        <div className="metric-box">
          <div className="metric-value">3</div>
          <div className="metric-label">Negociando</div>
        </div>
        <div className="metric-box">
          <div className="metric-value">2</div>
          <div className="metric-label">Cerrados</div>
        </div>
        <div className="metric-box">
          <div className="metric-value">$4.2k</div>
          <div className="metric-label">Pipeline</div>
        </div>
      </div>
    </div>
  );
}
