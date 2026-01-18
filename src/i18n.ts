import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import { locales } from './i18n-config';

// Using a switch statement for explicit imports is safer with bundlers
async function loadMessages(locale: string) {
  switch (locale) {
    case 'en':
      return {
        Auth: (await import('./messages/en/Auth.json')).default,
        Dashboard: (await import('./messages/en/Dashboard.json')).default,
        LandingPageAgitationSection: (await import('./messages/en/LandingPageAgitationSection.json')).default,
        LandingPageBridgeSection: (await import('./messages/en/LandingPageBridgeSection.json')).default,
        LandingPageContactForms: (await import('./messages/en/LandingPageContactForms.json')).default,
        LandingPageContactInfo: (await import('./messages/en/LandingPageContactInfo.json')).default,
        LandingPageFooter: (await import('./messages/en/LandingPageFooter.json')).default,
        LandingPageHeader: (await import('./messages/en/LandingPageHeader.json')).default,
        LandingPageHero: (await import('./messages/en/LandingPageHero.json')).default,
        LandingPageProblemSection: (await import('./messages/en/LandingPageProblemSection.json')).default,
        LandingPageProductsSection: (await import('./messages/en/LandingPageProductsSection.json')).default,
        LandingPageSolutionSection: (await import('./messages/en/LandingPageSolutionSection.json')).default,
        LandingPageSpecialOffer: (await import('./messages/en/LandingPageSpecialOffer.json')).default,
        LandingPageTestimonials: (await import('./messages/en/LandingPageTestimonials.json')).default,
      };
    case 'es':
      return {
        Auth: (await import('./messages/es/Auth.json')).default,
        Dashboard: (await import('./messages/es/Dashboard.json')).default,
        LandingPageAgitationSection: (await import('./messages/es/LandingPageAgitationSection.json')).default,
        LandingPageBridgeSection: (await import('./messages/es/LandingPageBridgeSection.json')).default,
        LandingPageContactForms: (await import('./messages/es/LandingPageContactForms.json')).default,
        LandingPageContactInfo: (await import('./messages/es/LandingPageContactInfo.json')).default,
        LandingPageFooter: (await import('./messages/es/LandingPageFooter.json')).default,
        LandingPageHeader: (await import('./messages/es/LandingPageHeader.json')).default,
        LandingPageHero: (await import('./messages/es/LandingPageHero.json')).default,
        LandingPageProblemSection: (await import('./messages/es/LandingPageProblemSection.json')).default,
        LandingPageProductsSection: (await import('./messages/es/LandingPageProductsSection.json')).default,
        LandingPageSolutionSection: (await import('./messages/es/LandingPageSolutionSection.json')).default,
        LandingPageSpecialOffer: (await import('./messages/es/LandingPageSpecialOffer.json')).default,
        LandingPageTestimonials: (await import('./messages/es/LandingPageTestimonials.json')).default,
      };
    default:
        // This should not happen if middleware is configured correctly, but as a fallback
        notFound();
  }
}
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
 
  return {
    messages: await loadMessages(locale)
  };
});
