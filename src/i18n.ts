import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import { locales } from './i18n-config';

async function loadMessages(locale: string) {
  const load = async (namespace: string) => (await import(`./messages/${locale}/${namespace}.json`)).default;
  
  const namespaces = [
    "Auth",
    "Dashboard",
    "LandingPageHeader",
    "LandingPageHero",
    "LandingPageProblemSection",
    "LandingPageAgitationSection",
    "LandingPageBridgeSection",
    "LandingPageSolutionSection",
    "LandingPageTestimonials",
    "LandingPageProductsSection",
    "LandingPageSpecialOffer",
    "LandingPageContactForms",
    "LandingPageContactInfo",
    "LandingPageFooter",
  ];
  
  const messages: { [key: string]: any } = {};
  for (const namespace of namespaces) {
    try {
        messages[namespace] = await load(namespace);
    } catch (e) {
        console.error(`Could not load messages for locale ${locale} and namespace ${namespace}`, e);
    }
  }
  
  return messages;
}
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
 
  return {
    messages: await loadMessages(locale)
  };
});
