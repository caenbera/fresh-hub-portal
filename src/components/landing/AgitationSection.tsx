'use client';
import { DollarSign, Users, Phone, TrendingUp } from 'lucide-react';

export function AgitationSection() {
  return (
    <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-6" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>¿Sabes lo que Esto le Está Costando a tu Negocio?</h2>
                <p className="text-xl text-red-100">Cada día que pasa con proveedores mediocres, tu reputación y ganancias están en riesgo</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                        <div className="bg-red-500 rounded-full p-3 mt-1">
                            <DollarSign className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Dinero Perdido por Merma</h3>
                            <p className="text-red-100">La merma de productos de mala calidad es dinero que sale directamente de tu bolsillo. Cada aguacate podrido, cada manojo de cilantro marchito.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="bg-red-500 rounded-full p-3 mt-1">
                            <Users className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Clientes Decepcionados</h3>
                            <p className="text-red-100">Tus clientes lo notan. Un mal ingrediente arruina el sabor de tus platos y la confianza que tanto te ha costado construir en la comunidad.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="bg-red-500 rounded-full p-3 mt-1">
                            <Phone className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Tiempo Perdido en Reclamos</h3>
                            <p className="text-red-100">Pierdes tiempo y energía en llamadas y reclamos, en lugar de atender a tu gente y hacer crecer tu negocio como mereces.</p>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <div className="bg-white bg-opacity-10 p-8 rounded-xl">
                        <TrendingUp className="text-6xl text-yellow-300 mb-4 mx-auto" />
                        <h3 className="text-2xl font-bold mb-4">¿Cuánto Te Está Costando NO Tener un Socio Confiable?</h3>
                        <p className="text-red-100 text-lg">Mientras sigues luchando con proveedores mediocres, tus competidores están creciendo con productos de calidad.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
