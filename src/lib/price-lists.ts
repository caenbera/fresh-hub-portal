// This file is obsolete and will be removed in a future update.
// Price lists are now managed dynamically in the 'pricelists' collection in Firestore.
// The new system can be accessed via "Clients" -> "Edit Client" -> "Manage Lists".
// This file is kept temporarily to avoid breaking existing imports, but it should not be used.

import type { PriceList } from '@/types';

export const priceLists: PriceList[] = [];
