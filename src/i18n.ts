import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from './i18n-config';

// Helper function to import all messages for a locale
async function getMessages(locale: string) {
  try {
    return {
      Auth: (await import(`./messages/${locale}/Auth.json`)).default,
      Dashboard: (await import(`./messages/${locale}/Dashboard.json`)).default,
      LandingPageAgitationSection: (await import(`./messages/${locale}/LandingPageAgitationSection.json`)).default,
      LandingPageBridgeSection: (await import(`./messages/${locale}/LandingPageBridgeSection.json`)).default,
      LandingPageContactForms: (await import(`./messages/${locale}/LandingPageContactForms.json`)).default,
      LandingPageContactInfo: (await import(`./messages/${locale}/LandingPageContactInfo.json`)).default,
      LandingPageFooter: (await import(`./messages/${locale}/LandingPageFooter.json`)).default,
      LandingPageHeader: (await import(`./messages/${locale}/LandingPageHeader.json`)).default,
      LandingPageHero: (await import(`./messages/${locale}/LandingPageHero.json`)).default,
      LandingPageProblemSection: (await import(`./messages/${locale}/LandingPageProblemSection.json`)).default,
      LandingPageProductsSection: (await import(`./messages/${locale}/LandingPageProductsSection.json`)).default,
      LandingPageSolutionSection: (await import(`./messages/${locale}/LandingPageSolutionSection.json`)).default,
      LandingPageSpecialOffer: (await import(`./messages/${locale}/LandingPageSpecialOffer.json`)).default,
      LandingPageTestimonials: (await import(`./messages/${locale}/LandingPageTestimonials.json`)).default,
    };
  } catch (error) {
    notFound();
  }
}

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }
 
  return {
    messages: await getMessages(locale)
  };
});