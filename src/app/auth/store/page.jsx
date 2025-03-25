'use client';

import { useState, useEffect } from 'react';
// import { supabase, prisma } from '@/lib/supabase';
import Cart from './cart/page';
import Subscription from './subscription/page';
import { checkSubscription } from '@/lib/checkSubscription';
import prisma from '@/lib/prisma';
import axios from 'axios';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      await checkSubscription(userData.user.id);
      const user = await prisma.user.findUnique({
        where: { id: userData.user.id },
        include: { scores: true },
      });
      setUser(user);

      const points = user.scores.reduce((sum, score) => sum + score.score, 0);
      setTotalPoints(points);

      // const products = await fetch('/api/products').then((res) => res.json());
      // setProducts(products);
      const fetchProducts = async() =>{
        try{
          const response = await axios.get(`/api/store/products`);
          const res = response.data;
          setProducts(re);
        }
        catch(err){
          console.error("Error getting products:",err);
        }
      }
      fetchProducts();
    };
    fetchData();
  }, []);

  function getPrice(basePrice) {
    if (!user) return basePrice;
    const type = user.subscriptionType;
    if (type === 'lifetime') return Math.round(basePrice * 0.5);
    if (type === '6months') return Math.round(basePrice * 0.7);
    if (type === '1month') return Math.round(basePrice * 0.9);
    return basePrice;
  }

  const addToCart = async (productId) => {
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ userId: user.id, productId, quantity: 1 }),
      headers: { 'Content-Type': 'application/json' },
    });
  };

  return (
    <div>
      <h1>Store</h1>
      <p>Total Points: {totalPoints}</p>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>Price: {getPrice(product.basePrice)} points</p>
          <button onClick={() => addToCart(product.id)}>Add to Cart</button>
        </div>
      ))}
      {user && <Cart userId={user.id} />}
      {user && <Subscription userId={user.id} />}
    </div>
  );
}