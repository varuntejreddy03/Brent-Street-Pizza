import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { API_URL } from '../config/api';

interface StripePaymentFormProps {
  orderId: string;
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
  total: number;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ orderId, clientSecret, onSuccess, onCancel, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.error) {
      setError(result.error.message || 'An unexpected error occurred.');
      setProcessing(false);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        // Sync payment status to backend
        try {
          const token = localStorage.getItem('token');
          await fetch(`${API_URL}/api/orders/update-payment-status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ orderId, status: 'Paid' })
          });
        } catch (err) {
          console.error('Failed to sync payment status:', err);
        }
        onSuccess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-[#E8D8C8] rounded-xl bg-[#FDFAF6]">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1A1A1A',
                '::placeholder': {
                  color: '#AAB7C4',
                },
              },
              invalid: {
                color: '#C8201A',
              },
            },
          }}
        />
      </div>

      {error && <div className="text-[#C8201A] text-sm font-inter">{error}</div>}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 px-6 py-4 border border-[#E8D8C8] text-[#555555] font-barlow font-700 text-[14px] uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A]/5 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-[2] bg-[#C8201A] hover:bg-[#9E1510] disabled:opacity-70 text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-6 py-4 rounded-xl transition-all shadow-[0_8px_24px_rgba(200,32,26,0.35)]"
        >
          {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

export default StripePaymentForm;
