// import { loadStripe } from '@stripe/stripe-js';

// Mock implementation for deployment testing
export const stripePromise = Promise.resolve({
  elements: () => ({}),
  createPaymentMethod: () => Promise.resolve({}),
  confirmCardPayment: () => Promise.resolve({ paymentIntent: { status: 'succeeded' } }),
} as any);

// export const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// ); 