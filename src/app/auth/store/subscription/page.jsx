'use client';
import { useState } from 'react';

export default function Subscription({ userId }) {
  const [type, setType] = useState('');

  const handleSubscribe = async () => {
    await fetch('/api/subscription', {
      method: 'POST',
      body: JSON.stringify({ userId, subscriptionType: type }),
      headers: { 'Content-Type': 'application/json' },
    });
  };

  return (
    <div>
      <h2>Upgrade Subscription</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Select</option>
        <option value="1month">1 Month (10 points)</option>
        <option value="6months">6 Months (50 points)</option>
        <option value="lifetime">Lifetime (200 points)</option>
      </select>
      <button onClick={handleSubscribe}>Subscribe</button>
    </div>
  );
}