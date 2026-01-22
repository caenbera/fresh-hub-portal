import type { Product, Offer, PriceList } from '@/types';

export const getFinalPrice = (product: Product, priceList: PriceList | null, offer?: Offer | null): number => {
    if (!product) return 0;
    
    // Check for an offer first
    if (offer && offer.productId === product.id) {
        switch (offer.type) {
            case 'percentage':
                return product.salePrice * (1 - offer.value / 100);
            case 'fixedPrice':
                return offer.value;
            // For combo/liquidation, the price logic might be different or based on original price
            // Assuming for now they don't have a simple price calculation here
            default:
                break;
        }
    }

    // Apply price list discount if no overriding offer
    if (priceList) {
        return product.salePrice * (1 - priceList.discount / 100);
    }
    
    return product.salePrice;
};

// This function calculates the *best* discount amount per unit
export const calculateDiscount = (product: Product, priceList: PriceList | null, offer?: Offer | null): { finalPrice: number, discount: number } => {
    if (!product) return { finalPrice: 0, discount: 0 };
    
    const originalPrice = product.salePrice;
    let offerDiscountAmount = 0;
    let priceListDiscountAmount = 0;

    // Calculate discount from offer
    if (offer && offer.productId === product.id) {
        if (offer.type === 'percentage') {
            offerDiscountAmount = originalPrice * (offer.value / 100);
        } else if (offer.type === 'fixedPrice') {
            offerDiscountAmount = originalPrice - offer.value;
        } else if (offer.type === 'liquidation') {
            // Example: Liquidation could be a 50% discount
             offerDiscountAmount = originalPrice * 0.5;
        }
        // Other offer types like combo might have complex discount logic
        // For simplicity, we assume they are priced as-is and the 'discount' is the difference
    }

    // Calculate discount from price list
    if (priceList) {
        priceListDiscountAmount = originalPrice * (priceList.discount / 100);
    }

    // Use the greater of the two discounts
    const bestDiscount = Math.max(offerDiscountAmount, priceListDiscountAmount);
    const finalPrice = originalPrice - bestDiscount;

    return { finalPrice, discount: bestDiscount };
};
