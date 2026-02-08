'use client';

import { CheckSquare, Route, X } from 'lucide-react';

interface BottomActionsProps {
  count: number;
  onClear: () => void;
  onGenerate: () => void;
}

export function BottomActions({ count, onClear, onGenerate }: BottomActionsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex gap-3 z-[1001] md:left-auto md:w-[400px] md:bottom-5 md:rounded-xl md:right-5">
      <button 
        className="flex-1 text-sm bg-gray-100 text-gray-700 font-bold rounded-lg flex items-center justify-center gap-2 py-3"
        onClick={onClear}
      >
        <X size={16} /> Limpiar
      </button>
      <button 
        className="flex-1 bg-primary text-primary-foreground font-bold rounded-lg flex items-center justify-center gap-2 py-3"
        onClick={onGenerate}
      >
        <Route size={16} /> Ruta ({count})
      </button>
    </div>
  );
}
