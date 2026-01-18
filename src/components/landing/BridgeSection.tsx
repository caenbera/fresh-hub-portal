'use client';

import { Frown, Smile, X, Check } from 'lucide-react';

export function BridgeSection() {
  const befores = [
    "Rezar para que el pedido llegue completo y a tiempo",
    "Pelear con proveedores que no te entienden",
    "Productos que no te enorgullecen en tu negocio",
    "Clientes que se van por falta de frescura",
    "Noches sin dormir pensando en el negocio",
  ];

  const afters = [
    "Tu negocio reconocido por tener los productos más frescos del barrio",
    "Clientes que regresan porque saben que aquí hay calidad",
    "Paz mental de tener un socio que nunca te falla",
    "Más tiempo para atender a tu familia y crecer",
    "El orgullo de servir productos auténticos de calidad",
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">De la Frustración al Éxito</h2>
                <p className="text-xl text-gray-300">Imagina la transformación de tu negocio</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
                {/* Before */}
                <div className="bg-red-900 bg-opacity-50 p-8 rounded-xl border border-red-500">
                    <div className="text-center mb-6">
                        <Frown className="text-4xl text-red-400 mb-4 mx-auto" />
                        <h3 className="text-2xl font-bold text-red-300">ANTES: La Lucha Diaria</h3>
                    </div>
                    <ul className="space-y-4 text-red-100">
                      {befores.map((item, i) => (
                        <li key={i} className="flex items-start space-x-3">
                            <X className="text-red-400 mt-1 shrink-0" />
                            <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                </div>
                {/* After */}
                <div className="bg-green-900 bg-opacity-50 p-8 rounded-xl border border-green-500">
                    <div className="text-center mb-6">
                        <Smile className="text-4xl text-green-400 mb-4 mx-auto" />
                        <h3 className="text-2xl font-bold text-green-300">DESPUÉS: El Éxito que Mereces</h3>
                    </div>
                    <ul className="space-y-4 text-green-100">
                        {afters.map((item, i) => (
                          <li key={i} className="flex items-start space-x-3">
                              <Check className="text-green-400 mt-1 shrink-0" />
                              <span>{item}</span>
                          </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="text-center mt-12">
                <div className="bg-accent p-6 rounded-xl inline-block">
                    <h3 className="text-2xl font-bold mb-2">🌉 EL PUENTE ES THE FRESH HUB</h3>
                    <p className="text-lg">Somos el puente directo entre el campo y tu negocio. Conectamos tu sazón con la calidad que merece.</p>
                </div>
            </div>
        </div>
    </section>
  );
}
