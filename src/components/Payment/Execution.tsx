import { useRouter } from 'next/router';
import { useState } from 'react';

export default function PaymentExecution({ voucher }) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voucherId: voucher.id,
          method: paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      router.push('/payments');
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Execute Payment</h2>
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Method
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="BANK_TRANSFER">Bank Transfer</option>
          <option value="CASH">Cash</option>
          <option value="CHECK">Check</option>
        </select>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Voucher ID: {voucher.id}</p>
          <p className="text-sm text-gray-500">Amount: ${voucher.amount}</p>
        </div>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Confirm Payment'}
        </button>
      </div>
    </div>
  );
}