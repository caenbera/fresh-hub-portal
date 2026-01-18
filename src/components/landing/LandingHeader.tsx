'use client';

import { Sprout, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingPageHeader() {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-3">
                    <Sprout className="h-12 w-12 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-headline">The Fresh Hub</h1>
                        <p className="text-sm text-gray-600">Tu Socio de Confianza</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-green-600">
                        <MessageCircle />
                        <span className="font-semibold">Hablamos Español</span>
                    </div>
                    <Button asChild className="bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
                      <a href="tel:+1-555-FRESH">
                          <Phone className="mr-2" size={16} />Llámanos Ahora
                      </a>
                    </Button>
                </div>
            </div>
        </div>
    </header>
  );
}
