'use client';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin } from 'lucide-react';

export function ContactInfo() {
  return (
    <section id="contacto" className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Hablemos en tu Idioma</h2>
                <p className="text-xl text-gray-300">Estamos aquí para apoyar tu negocio</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                    <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Phone size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Llámanos Ahora</h3>
                    <p className="text-gray-300 mb-4">Habla directamente con José</p>
                    <a href="tel:+1-555-FRESH" className="text-green-400 text-xl font-bold hover:text-green-300">
                        (555) FRESH-HUB
                    </a>
                </div>
                <div className="text-center">
                    <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Mail size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Escríbenos</h3>
                    <p className="text-gray-300 mb-4">Respuesta en menos de 2 horas</p>
                    <a href="mailto:hola@thefreshhub.com" className="text-orange-400 text-lg hover:text-orange-300">
                        hola@thefreshhub.com
                    </a>
                </div>
                <div className="text-center">
                    <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <MapPin size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Servimos Chicago</h3>
                    <p className="text-gray-300 mb-4">Y toda el área metropolitana</p>
                    <p className="text-blue-400">Entregas de Lunes a Sábado</p>
                </div>
            </div>
            <div className="text-center mt-12 pt-8 border-t border-gray-700">
                <p className="text-lg text-gray-300 mb-4">¿Prefieres que te llamemos?</p>
                <Button asChild size="lg" className="bg-primary text-primary-foreground px-8 py-3 text-lg font-semibold hover:bg-green-700 transition">
                  <a href="#cotizacion">
                    Déjanos tus Datos y te Llamamos
                  </a>
                </Button>
            </div>
        </div>
    </section>
  );
}
