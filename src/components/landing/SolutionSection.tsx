'use client';
import { useTranslations } from 'next-intl';
import { Heart, Languages, Truck, Award } from 'lucide-react';

export function SolutionSection() {
  const t = useTranslations('LandingPageSolutionSection');
  
  const solutions = [
    { icon: Heart, title: t('solution_1_title'), desc: t('solution_1_desc') },
    { icon: Languages, title: t('solution_2_title'), desc: t('solution_2_desc') },
    { icon: Truck, title: t('solution_3_title'), desc: t('solution_3_desc') },
  ];

  return (
    <section className="py-12 lg:py-24 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-headline text-yellow-300">{t('solution_title')}</h2>
          <p className="mt-4 text-lg text-gray-300">{t('solution_subtitle')}</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center items-center h-20 w-20 rounded-full bg-primary/20 mx-auto">
                <solution.icon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mt-6 text-2xl font-bold">{solution.title}</h3>
              <p className="mt-2 text-gray-400">{solution.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 bg-gray-900 border-2 border-yellow-300 p-8 rounded-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold flex items-center justify-center gap-3"><Award className="text-yellow-300" /> {t('solution_promise_title')}</h3>
            <ul className="mt-6 space-y-4 text-lg">
                <li>✅ {t('solution_promise_1')}</li>
                <li>✅ {t('solution_promise_2')}</li>
            </ul>
        </div>
      </div>
    </section>
  );
}
