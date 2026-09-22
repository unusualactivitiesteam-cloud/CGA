/**
 * Payment Routing & Region-Based Method Determination Service
 * 
 * Strict Scope:
 * - Nigeria: Bank Transfer (Opay & MONIEPOINT) + Crypto (Bitcoin, USDT TRC20)
 * - All other countries: Crypto only (Bitcoin, USDT TRC20)
 * - USDT ERC20 is strictly excluded from all payment flows.
 */

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export const NIGERIA_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'opay',
    bankName: 'Opay',
    accountNumber: '6550002094',
    accountName: 'TAVARI WAVE NETWORK/CGA TRADES'
  },
  {
    id: 'moniepoint',
    bankName: 'MONIEPOINT',
    accountNumber: '9132530055',
    accountName: 'TAVARI WAVE NETWORK/CGA TRADES'
  }
];

export const CRYPTO_PAYMENT_OPTIONS = {
  usdt: {
    id: 'usdt',
    name: 'USDT (TRC20)',
    network: 'TRON (TRC20)',
    symbol: 'USDT',
    address: 'TJTym5Qs77hBEr2kEiJPVEQwR4kM2AosSG',
    warning: 'Please send only USDT TRC-20 to this address. Transferring to any other network will result in permanent loss of your funds.'
  },
  btc: {
    id: 'btc',
    name: 'Bitcoin (BTC)',
    network: 'Native Bitcoin Network',
    symbol: 'BTC',
    address: 'bc1p2mw24svf4yg5d6v4lxk5309jlcgcqjdagaefuc0adac9z4ys2p5qfq9t8t',
    warning: 'Please send only Bitcoin (BTC) to this address. Transferring to any other network will result in permanent loss of your funds.'
  }
} as const;

export type AllowedCryptoType = keyof typeof CRYPTO_PAYMENT_OPTIONS;

/**
 * Deterministically checks if a country or country code qualifies as Nigeria.
 */
export function isNigeriaRegion(country?: string | null, code?: string | null): boolean {
  if (!country && !code) return false;
  const c = (country || '').trim().toLowerCase();
  const cd = (code || '').trim().toUpperCase();

  if (cd === 'NG' || cd === 'NGA') return true;
  if (c === 'nigeria') return true;
  if (c.includes('nigeria') || c.includes('lagos')) return true;

  return false;
}

export interface PaymentEligibilityResponse {
  country: string;
  countryCode: string;
  isNigeria: boolean;
  availableMethods: ('bank' | 'crypto')[];
  bankAccounts: BankAccount[];
  cryptoOptions: typeof CRYPTO_PAYMENT_OPTIONS;
}

/**
 * Fetches server-verified payment eligibility for the authenticated user or location.
 * Falls back to deterministic local check if network is slow or offline.
 */
export async function fetchPaymentEligibility(
  token?: string | null,
  fallbackCountry?: string | null,
  fallbackCode?: string | null
): Promise<PaymentEligibilityResponse> {
  const localIsNigeria = isNigeriaRegion(fallbackCountry, fallbackCode);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `/api/payment/eligibility?country=${encodeURIComponent(fallbackCountry || '')}&code=${encodeURIComponent(fallbackCode || '')}`;
    const res = await fetch(url, { headers });

    if (res.ok) {
      const data = await res.json();
      return {
        country: data.country || (localIsNigeria ? 'Nigeria' : fallbackCountry || 'United States'),
        countryCode: data.countryCode || (localIsNigeria ? 'NG' : fallbackCode || 'US'),
        isNigeria: !!data.isNigeria,
        availableMethods: data.isNigeria ? ['bank', 'crypto'] : ['crypto'],
        bankAccounts: data.isNigeria ? NIGERIA_BANK_ACCOUNTS : [],
        cryptoOptions: CRYPTO_PAYMENT_OPTIONS
      };
    }
  } catch (err) {
    console.warn("[PaymentRouting] Server eligibility fetch error, using deterministic local evaluation:", err);
  }

  return {
    country: localIsNigeria ? 'Nigeria' : fallbackCountry || 'Global',
    countryCode: localIsNigeria ? 'NG' : fallbackCode || 'GL',
    isNigeria: localIsNigeria,
    availableMethods: localIsNigeria ? ['bank', 'crypto'] : ['crypto'],
    bankAccounts: localIsNigeria ? NIGERIA_BANK_ACCOUNTS : [],
    cryptoOptions: CRYPTO_PAYMENT_OPTIONS
  };
}

/**
 * Non-Nigeria Bank Transfer Request WhatsApp Configuration
 * Phone: +2349065244842
 * Deep link text: "I want to request for account details to settle this payment. Amount: $[EXACT AMOUNT]"
 */
export const WHATSAPP_BANK_REQUEST_PHONE = '+2349065244842';
export const WHATSAPP_BANK_REQUEST_NUMBER_CLEAN = '2349065244842';

export function formatTransferAmount(amount: number | string): string {
  if (typeof amount === 'number') {
    return amount.toLocaleString('en-US');
  }
  const clean = String(amount).trim();
  const num = Number(clean.replace(/,/g, '').replace(/^\$/, ''));
  if (!isNaN(num) && num > 0) {
    return num.toLocaleString('en-US');
  }
  return clean.replace(/^\$/, '');
}

export function getWhatsAppBankTransferUrl(amount: number | string): string {
  const formatted = formatTransferAmount(amount);
  const message = `I want to request for account details to settle this payment. Amount: $${formatted}`;
  return `https://wa.me/${WHATSAPP_BANK_REQUEST_NUMBER_CLEAN}?text=${encodeURIComponent(message)}`;
}
