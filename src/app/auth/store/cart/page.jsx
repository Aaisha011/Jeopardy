'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function Cart({ userId }) {
  const [cartItems, setCartItems] = useState([]);
  const params = useParams();

  useEffect(()=>{
      const fetchCart = async()=>{
        try{
          const response = await axios.get(`/api/cart?userId=${userId}`);
          const res = response.data;
          setCartItems(res);
        }
        catch(err){
          console.err("Error fetching cart data:",err);
        }
      }
      fetchCart();
  },[userId]);

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item.id}>
          <p>{item.product.name} - {item.quantity}</p>
        </div>
      ))}
    </div>
  );
}