'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ProductsSection() {
  const t = useTranslations('LandingPageProductsSection');

  const products = [
    { title: t('product_1_title'), desc: t('product_1_desc'), tag: t('product_1_tag'), img: 'https://picsum.photos/seed/prod1/400/300', hint: 'avocados' },
    { title: t('product_2_title'), desc: t('product_2_desc'), tag: t('product_2_tag'), img: 'https://picsum.photos/seed/prod2/400/300', hint: 'chili peppers' },
    { title: t('product_3_title'), desc: t('product_3_desc'), tag: t('product_3_tag'), img: 'https://picsum.photos/seed/prod3/400/300', hint: 'cilantro' },
    { title: t('product_4_title'), desc: t('product_4_desc'), tag: t('product_4_tag'), img: 'https://picsum.photos/seed/prod4/400/300', hint: 'tomatillos' },
  ];

  return (
    <section className="py-12 lg:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-headline">{t('products_section_title')}</h2>
          <p className="mt-4 text-lg text-gray-300">{t('products_section_subtitle')}</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.title} className="bg-gray-800 border-gray-700 text-white flex flex-col">
              <CardHeader className="p-0">
                <Image 
                  src={product.img} 
                  alt={product.title} 
                  width={400} 
                  height={300} 
                  className="rounded-t-lg object-cover aspect-[4/3]"
                  data-ai-hint={product.hint}
                />
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col">
                <Badge variant="secondary" className="bg-yellow-300 text-gray-900 self-start">{product.tag}</Badge>
                <h3 className="text-xl font-bold mt-4">{product.title}</h3>
                <p className="text-gray-400 mt-2 flex-grow">{product.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
            <p className="text-lg">{t('products_section_cta_prompt')}</p>
            <Button size="lg" className="mt-4 bg-primary hover:bg-primary/90">{t('products_section_cta_button')}</Button>
        </div>
      </div>
    </section>
  );
}
