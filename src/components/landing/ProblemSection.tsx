'use client';
import { AlertTriangle, Clock, Languages } from 'lucide-react';

export function ProblemSection() {
  return (
    <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Te Suena Familiar Esta Situación?</h2>
                <p className="text-xl text-gray-600">Los dolores de cabeza que todo dueño de negocio latino conoce...</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-red-50 p-8 rounded-xl border-l-4 border-red-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div className="text-red-500 text-3xl mb-4">
                        <AlertTriangle size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Productos de Mala Calidad</h3>
                    <p className="text-gray-700">Cansado de que los aguacates lleguen golpeados, los chiles sin el picor correcto, o proveedores que no entienden la diferencia entre un jalapeño y un serrano.</p>
                </div>
                <div className="bg-orange-50 p-8 rounded-xl border-l-4 border-orange-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div className="text-orange-500 text-3xl mb-4">
                        <Clock size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Entregas Impuntuales</h3>
                    <p className="text-gray-700">La dificultad de encontrar tomatillo fresco, cilantro que huela 'de verdad' o plátanos en el punto exacto de maduración cuando los necesitas.</p>
                </div>
                <div className="bg-yellow-50 p-8 rounded-xl border-l-4 border-yellow-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div className="text-yellow-600 text-3xl mb-4">
                        <Languages size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Barrera del Idioma</h3>
                    <p className="text-gray-700">Proveedores que no te entienden, no hablan tu idioma, y no comprenden las necesidades específicas de tu negocio latino.</p>
                </div>
            </div>
        </div>
    </section>
  );
}
