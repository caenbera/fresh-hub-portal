'use client';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


export function Testimonials() {

  const testimonials = [
    { text: `"The Fresh Hub me cambió el negocio. Mis clientes siempre me felicitan por la frescura de mis verduras. Desde que trabajo con ellos, mi supermercado es el referente del barrio."`, name: "María González", location: "Supermercado La Esperanza, Pilsen", initial: "M", color: "bg-green-500" },
    { text: `"Por fin un proveedor que entiende lo que necesito para mi taquería. Los chiles tienen el picor perfecto, el cilantro huele como debe ser. Mis tacos nunca habían tenido tanto sabor."`, name: "Carlos Mendoza", location: "Taquería El Corazón, Little Village", initial: "C", color: "bg-accent" },
    { text: `"Llevo 15 años en Chicago y nunca había encontrado un proveedor tan confiable. Hablan mi idioma, entienden mi negocio, y nunca me fallan. Son mi familia."`, name: "Rosa Herrera", location: "Restaurante Mi Pueblo, Back of the Yards", initial: "R", color: "bg-red-500" },
  ];

  return (
    <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo Que Dicen Nuestros Socios</h2>
                <p className="text-xl text-gray-600">La confianza de la comunidad latina en Chicago</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-gray-50 p-8 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <CardContent className="p-0">
                      <div className="flex items-center mb-4">
                          <div className="flex text-yellow-400 mr-2">
                              {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5"/>)}
                          </div>
                      </div>
                      <p className="text-gray-700 mb-6 italic">{testimonial.text}</p>
                      <div className="flex items-center">
                          <Avatar className={`w-12 h-12 mr-4 ${testimonial.color}`}>
                            <AvatarFallback className="text-white font-bold bg-transparent">{testimonial.initial}</AvatarFallback>
                          </Avatar>
                          <div>
                              <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                              <p className="text-gray-600">{testimonial.location}</p>
                          </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
        </div>
    </section>
  );
}
