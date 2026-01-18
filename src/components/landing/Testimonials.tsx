'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function Testimonials() {
  const t = useTranslations('LandingPageTestimonials');

  const testimonials = [
    { text: t('testimonial_1_text'), name: t('testimonial_1_name'), location: t('testimonial_1_location'), img: 'https://picsum.photos/seed/user1/100' },
    { text: t('testimonial_2_text'), name: t('testimonial_2_name'), location: t('testimonial_2_location'), img: 'https://picsum.photos/seed/user2/100' },
    { text: t('testimonial_3_text'), name: t('testimonial_3_name'), location: t('testimonial_3_location'), img: 'https://picsum.photos/seed/user3/100' },
  ];

  return (
    <section className="py-12 lg:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-headline">{t('testimonials_title')}</h2>
          <p className="mt-4 text-lg text-gray-300">{t('testimonials_subtitle')}</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="h-5 w-5" />)}
                </div>
                <p className="italic">"{testimonial.text}"</p>
                <div className="flex items-center mt-6">
                  <Image 
                    src={testimonial.img} 
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                    data-ai-hint="person photo"
                  />
                  <div className="ml-4">
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.location}</p>
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
