'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function ProblemSection() {
  const t = useTranslations('LandingPageProblemSection');

  const problems = [
    { title: t('problem_1_title'), desc: t('problem_1_desc'), img: 'https://picsum.photos/seed/problem1/500/300', hint: 'bruised avocado' },
    { title: t('problem_2_title'), desc: t('problem_2_desc'), img: 'https://picsum.photos/seed/problem2/500/300', hint: 'empty shelf' },
    { title: t('problem_3_title'), desc: t('problem_3_desc'), img: 'https://picsum.photos/seed/problem3/500/300', hint: 'confused person' },
  ];

  return (
    <section className="py-12 lg:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-headline">{t('problem_title')}</h2>
          <p className="mt-4 text-lg text-gray-300">{t('problem_subtitle')}</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
              <Image 
                src={problem.img}
                alt={problem.title}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
                data-ai-hint={problem.hint}
              />
              <div className="p-6">
                <h3 className="font-bold text-xl text-yellow-300">{problem.title}</h3>
                <p className="mt-2 text-gray-400">{problem.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
