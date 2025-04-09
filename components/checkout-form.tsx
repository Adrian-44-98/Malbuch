"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Mock components for testing deployment
const MockCardElement = () => {
  return (
    <div className="border p-4 rounded">
      <p className="text-gray-500">Mock Card Input (For Testing Only)</p>
    </div>
  );
};

export const CheckoutForm = ({ orderId }: { orderId: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const stripe = useStripe();
  // const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Mock successful payment for deployment testing
      setTimeout(() => {
        toast.success('Payment successful! (Mock for deployment testing)');
        router.push('/success');
      }, 1500);

      // // Create payment intent
      // const response = await fetch('/api/stripe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ orderId }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to create payment intent');
      // }

      // const { clientSecret } = await response.json();

      // // Confirm payment
      // const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      //   clientSecret,
      //   {
      //     payment_method: {
      //       card: elements.getElement(CardElement)!,
      //     },
      //   }
      // );

      // if (stripeError) {
      //   throw new Error(stripeError.message);
      // }

      // if (paymentIntent.status === 'succeeded') {
      //   toast.success('Payment successful!');
      //   router.push('/success');
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card">Card Details</Label>
        <MockCardElement />
        {/* <CardElement
          id="card"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        /> */}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Processing...' : 'Pay Now (Mock)'}
      </Button>
    </form>
  );
};

export const StripeCheckoutForm = ({ orderId }: { orderId: string }) => {
  return (
    // <Elements stripe={stripePromise}>
      <CheckoutForm orderId={orderId} />
    // </Elements>
  );
};

