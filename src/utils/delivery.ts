import { Config } from '@/constants/config';

export const OUTSIDE_INDORE_DELIVERY_CHARGE = Config.outsideIndoreDeliveryCharge ?? 250;
export const LOCAL_INDORE_DELIVERY_CHARGE = 0;

/**
 * Checks if an address or city belongs to Indore, MP.
 * Indore pincodes start with 452 (e.g. 452001 to 452020).
 */
export function isIndoreAddress(address?: string | null, city?: string | null): boolean {
  if (!address && !city) return false;

  const combined = `${address || ''} ${city || ''}`.toLowerCase();

  // Check for the word "indore"
  if (combined.includes('indore')) {
    return true;
  }

  // Check for Indore pincode pattern (452xxx)
  const indorePincodePattern = /\b452\d{3}\b/;
  if (indorePincodePattern.test(combined)) {
    return true;
  }

  return false;
}

export interface DeliveryZoneInfo {
  isLocalIndore: boolean;
  zoneLabel: string;
  badgeLabel: string;
  deliveryCharge: number;
  deliveryChargeFormatted: string;
  policyNote: string;
  hubLocation: string;
}

export function getDeliveryZoneInfo(
  address?: string | null,
  forceOutsideIndore?: boolean
): DeliveryZoneInfo {
  const isLocal = forceOutsideIndore ? false : isIndoreAddress(address);
  const deliveryCharge = isLocal ? LOCAL_INDORE_DELIVERY_CHARGE : OUTSIDE_INDORE_DELIVERY_CHARGE;

  return {
    isLocalIndore: isLocal,
    zoneLabel: isLocal ? 'Indore Local Dispatch' : 'Outside Indore Transport',
    badgeLabel: isLocal ? 'Indore Local Hub' : 'Outside Indore (+₹250)',
    deliveryCharge,
    deliveryChargeFormatted: isLocal ? 'FREE' : `+₹${deliveryCharge}`,
    policyNote: isLocal
      ? 'Direct factory dispatch within Indore city limits (No extra delivery charge).'
      : `Delivery destination is outside Indore. An additional transport surcharge of ₹${deliveryCharge} applies for inter-district dispatch.`,
    hubLocation: 'Indore, Madhya Pradesh',
  };
}
