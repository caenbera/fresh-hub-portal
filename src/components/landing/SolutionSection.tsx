'use client';

import { Leaf, MessageCircle, Clock, Shield, Users } from 'lucide-react';

export function SolutionSection() {
  return (
    <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-6" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>Somos Tu Socio de Confianza</h2>
                <p className="text-xl text-green-100">The Fresh Hub: Tu parcero, tu pana, tu compa en Chicago</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white bg-opacity-10 p-8 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <Leaf className="text-4xl text-yellow-300 mb-4 mx-auto" />
                    <h3 className="text-xl font-bold mb-4">Frescura Auténtica</h3>
                    <p className="text-green-100">Productos de calidad 'como los del rancho', directamente del campo a tu puerta. El cilantro huele de verdad, los aguacates en su punto perfecto.</p>
                </div>
                <div className="bg-white bg-opacity-10 p-8 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <MessageCircle className="text-4xl text-yellow-300 mb-4 mx-auto" />
                    <h3 className="text-xl font-bold mb-4">Hablamos tu Idioma</h3>
                    <p className="text-green-100">Entendemos tu negocio porque somos de los tuyos. Llama y habla directamente con José, quien conoce la diferencia entre cada chile.</p>
                </div>
                <div className="bg-white bg-opacity-10 p-8 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <Clock className="text-4xl text-yellow-300 mb-4 mx-auto" />
                    <h3 className="text-xl font-bold mb-4">Puntualidad Garantizada</h3>
                    <p className="text-green-100">Entregas siempre a tiempo, para que tú solo te preocupes de hacer brillar tu sazón y atender a tu gente con orgullo.</p>
                </div>
            </div>
            <div className="bg-white bg-opacity-20 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-center mb-6">🏆 Nuestra Promesa de Calidad</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                        <Shield className="text-yellow-300" size={24} />
                        <span className="text-lg">Si el producto no cumple tu estándar, te lo cambiamos. Sin preguntas.</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Users className="text-yellow-300" size={24} />
                        <span className="text-lg">Empresa Familiar Sirviendo a la Comunidad de Chicago</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
