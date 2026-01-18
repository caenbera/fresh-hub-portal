import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from './i18n-config';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  let messages;
  switch (locale) {
    case 'en':
      messages = (await import('./messages/en.json')).default;
      break;
    case 'es':
      messages = (await import('./messages/es.json')).default;
      break;
    default:
      // Fallback to Spanish if something goes wrong
      messages = (await import('./messages/es.json')).default;
  }
 
  return {
    locale,
    messages
  };
});