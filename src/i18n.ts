import {getRequestConfig} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './i18n-config';

// Note: This file will be used later in the migration.
// For now, it's just setting up the structure.
// The message files (e.g., `./messages/en.json`) will be created in the next step.
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
 
  try {
    return {
      messages: (await import(`./messages/${locale}.json`)).default
    };
  } catch (error) {
    // This will happen in Step 1 because the files don't exist yet.
    // We'll return an empty object to avoid breaking the build.
    return {
      messages: {}
    }
  }
});
