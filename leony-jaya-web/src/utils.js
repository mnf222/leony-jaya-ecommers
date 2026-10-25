export const rupiah = (n) =>
  'Rp ' + Number(n).toLocaleString('id-ID', { maximumFractionDigits: 0 });

export function translateError(message) {
  if (!message) return 'Something went wrong. Please try again.';

  const exactTranslations = {
    'Invalid login credentials': 'The email or password is incorrect.',
    'Email not confirmed': 'Your email has not been confirmed. Please check your inbox.',
    'User already registered': 'This email is already registered. Please sign in.',
    'Database error saving new user': 'Your registration could not be saved. Please try again shortly.',
    'Failed to fetch': 'Unable to connect to the server. Please check your internet connection.',
    'Product not found.': 'Product not found.',
    'Please select a size.': 'Please select a size.',
    'Passwords do not match.': 'Your passwords do not match.',
    'You must be signed in to place an order.': 'Please sign in before placing an order.',
    'Invalid payment method.': 'The payment method is invalid.',
    'Items must be an array.': 'The order item list is invalid.',
    'Each item requires a valid product_id, quantity, and size.': 'The order item details are invalid.',
    'An order must contain between 1 and 50 items.': 'An order must contain between 1 and 50 items.',
    'permission denied for function checkout_order': 'Checkout is not enabled yet. Please contact customer service.',
    'Shipping details are required.': 'Please fill in your shipping details.',
    'Shipping details are invalid.': 'Please enter a valid name, phone number and full address.',
    'You can order at most 20 of one item.': 'You can order at most 20 of one item.',
    'Only pending orders can be cancelled.': 'Only orders that are still pending can be cancelled.',
    'Order not found.': 'We could not find that order.',
    'This order does not need a payment proof.': 'This order does not need a payment proof.',
    'Proof file was not uploaded.': 'The payment proof was not uploaded. Please try again.',
  };
  const exactMatch = exactTranslations[message];
  if (exactMatch) return exactMatch;

  const insufficientStock = message.match(/^Insufficient stock for (.+?)\.?$/i);
  if (insufficientStock) return `There is not enough stock for ${insufficientStock[1]}.`;

  const sizeMissing = message.match(/^Size (.+) is not available for (.+?)\.?$/i);
  if (sizeMissing) return `Size ${sizeMissing[1]} is not available for ${sizeMissing[2]}.`;

  // Messages we raise ourselves in the browser are already user-friendly.
  if (/^(Only JPG|The image must|Please choose|The order was not updated)/.test(message)) return message;

  if (message.startsWith('A product in this order is unavailable')) {
    return 'A product in this order is no longer available.';
  }
  if (message.startsWith('Could not find the function public.checkout_order')) {
    return 'Checkout has not been set up yet. Please contact customer service.';
  }
  if (message.startsWith('Password should be at least')) {
    return 'Your password does not meet the minimum length requirement.';
  }

  return `An error occurred: ${message}`;
}

// Pick black or white text for readable contrast on an accent-colored background.
export function contrastText(hex) {
  const h = (hex || '#FFFFFF').replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#0D0D0D' : '#FFFFFF';
}

// size_guide lines look like "30 - Waist 76cm | Length 101cm"; take the leading size token.
export function parseSizes(guide) {
  const found = [...(guide || '').matchAll(/^\s*([A-Za-z0-9]+)\s*[-–:|]/gm)].map((m) => m[1]);
  return found.length ? found : ['28', '30', '32', '34'];
}
