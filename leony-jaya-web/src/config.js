// Payment instructions shown after checkout. Set these in .env (see .env.example);
// never hard-code real account numbers in the repository.
export const BANK_INSTRUCTIONS = import.meta.env.VITE_BANK_INSTRUCTIONS
  || 'Please contact us on WhatsApp for our bank account details.';

export const QRIS_IMAGE_URL = import.meta.env.VITE_QRIS_IMAGE_URL || '';

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '6285922393949';
