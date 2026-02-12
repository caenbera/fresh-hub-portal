'use client';
import { useState } from 'react';
import { Wand, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { suggestRoute, type SuggestRouteOutput } from '@/ai/flows/suggest-route-flow';
import type { Prospect } from '@/types';

interface SmartClusterProps {
  prospects: Prospect[];
  onAcceptCluster: (prospectIds: string[]) => void;
}

export function SmartCluster({ prospects, onAcceptCluster }: SmartClusterProps) {
  const [suggestion, setSuggestion] = useState<SuggestRouteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateSuggestion = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    // We only need specific fields for the AI, to keep the payload smaller.
    const prospectsForAI = prospects.map(p => ({
      id: p.id,
      address: p.address,
      status: p.status,
      potentialValue: p.potentialValue || 0,
    }));

    try {
      const result = await suggestRoute({ prospects: prospectsForAI });
      setSuggestion(result);
    } catch (e: any) {
      console.error("Failed to generate route suggestion:", e);
      setError("Could not generate a suggestion at this time. Please try again later.");
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to get a route suggestion from the AI model.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (suggestion) {
      onAcceptCluster(suggestion.prospectIds);
      // We can clear the suggestion after accepting it
      setSuggestion(null);
    }
  };

  const handleClear = () => {
    setSuggestion(null);
    setError(null);
  };
  
  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toFixed(0)}`;
  };


  return (
    <div className="smart-cluster">
      <div className="cluster-header">
        <div className="cluster-title">
          <Wand size={16} />
          Ruta Inteligente Sugerida
        </div>
        {suggestion && !isLoading && (
            <div className="cluster-badge">Top Sugerencia</div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-sm font-medium text-center">Analizando rutas...</p>
        </div>
      ) : suggestion ? (
        <div>
            <div className="cluster-stats">
                <div className="cluster-stat">
                <div className="cluster-stat-value">{suggestion.prospectCount}</div>
                <div className="cluster-stat-label">Prospectos</div>
                </div>
                <div className="cluster-stat">
                <div className="cluster-stat-value">{suggestion.estimatedKm.toFixed(1)}</div>
                <div className="cluster-stat-label">Km (est.)</div>
                </div>
                <div className="cluster-stat">
                <div className="cluster-stat-value">{formatCurrency(suggestion.totalPotentialValue)}</div>
                <div className="cluster-stat-label">Potencial</div>
                </div>
            </div>
            <div className="flex gap-2 mt-3">
                <Button variant="outline" className="w-full" onClick={handleClear}>
                    <X size={16} className="mr-2"/> Limpiar
                </Button>
                <Button className="w-full" onClick={handleAccept}>
                    <Check size={16} className="mr-2"/> Aceptar Ruta
                </Button>
            </div>
        </div>
      ) : (
        <div className="text-center p-4">
            <p className="text-sm text-muted-foreground mb-3">
                Analiza tus prospectos para encontrar la ruta más densa y valiosa.
            </p>
            <Button className="w-full" onClick={handleGenerateSuggestion}>
                <Wand size={16} className="mr-2" />
                Generar Sugerencia
            </Button>
            {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}
