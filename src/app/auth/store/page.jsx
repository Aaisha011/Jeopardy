// import { useState, useEffect } from 'react';
// // import { supabase, prisma } from '@/lib/supabase';
// import Cart from './cart/page';
// import Subscription from './subscription/page';
// import { checkSubscription } from '@/lib/checkSubscription';
// import prisma from '@/lib/prisma';
// import axios from 'axios';

// export default function Store() {
//   const [products, setProducts] = useState([]);
//   const [user, setUser] = useState(null);
//   const [totalPoints, setTotalPoints] = useState(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data: userData } = await supabase.auth.getUser();
//       await checkSubscription(userData.user.id);
//       const user = await prisma.user.findUnique({
//         where: { id: userData.user.id },
//         include: { scores: true },
//       });
//       setUser(user);

//       const points = user.scores.reduce((sum, score) => sum + score.score, 0);
//       setTotalPoints(points);

//       // const products = await fetch('/api/products').then((res) => res.json());
//       // setProducts(products);
//       const fetchProducts = async() =>{
//         try{
//           const response = await axios.get(`/api/store/products`);
//           const res = response.data;
//           setProducts(re);
//         }
//         catch(err){
//           console.error("Error getting products:",err);
//         }
//       }
//       fetchProducts();
//     };
//     fetchData();
//   }, []);

//   function getPrice(basePrice) {
//     if (!user) return basePrice;
//     const type = user.subscriptionType;
//     if (type === 'lifetime') return Math.round(basePrice * 0.5);
//     if (type === '6months') return Math.round(basePrice * 0.7);
//     if (type === '1month') return Math.round(basePrice * 0.9);
//     return basePrice;
//   }

//   const addToCart = async (productId) => {
//     await fetch('/api/cart', {
//       method: 'POST',
//       body: JSON.stringify({ userId: user.id, productId, quantity: 1 }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//   };

//   return (
//     <div>
//       <h1>Store</h1>
//       <p>Total Points: {totalPoints}</p>
//       {products.map((product) => (
//         <div key={product.id}>
//           <h2>{product.name}</h2>
//           <p>Price: {getPrice(product.basePrice)} points</p>
//           <button onClick={() => addToCart(product.id)}>Add to Cart</button>
//         </div>
//       ))}
//       {user && <Cart userId={user.id} />}
//       {user && <Subscription userId={user.id} />}
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Store() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/store/categories');
        const categoriesArray = Array.isArray(response.data)
          ? response.data
          : response.data.categories || [];
        setCategories(categoriesArray);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch all products (optional, if you want to show all initially)
  const fetchAllProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/store/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching all products:', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products by category
  const fetchProductsByCategory = async (categoryId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/store/products/byCategory?categoryId=${categoryId}`);
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products by category:', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      // If clicking the same category, clear it and optionally fetch all products
      setSelectedCategory(null);
      setProducts([]); // Clear products instead of fetching all
      // Uncomment the next line if you want to fetch all products when clearing
      // fetchAllProducts();
    } else {
      // Select new category and fetch its products
      setSelectedCategory(categoryId);
      fetchProductsByCategory(categoryId);
    }
  };

  const handleClick = () =>{
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-gray-300 py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        Store Categories
      </h1>

      {/* Categories List */}
      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories available.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`bg-white/30 rounded-lg shadow-md shadow-black p-6 cursor-pointer ring-2 ring-white outline-none hover:shadow-lg transition-shadow duration-200 ${
                selectedCategory === category.id ? 'border-4 border-purple-900' : ''
              }`}
            >
              <h2 className="text-xl text-center font-semibold text-gray-900 mb-2">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-gray-600">{category.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Products List */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {selectedCategory ? 'Products in Selected Category' : 'Select a Category'}
        </h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">
            {selectedCategory ? 'No products found in this category.' : 'Please select a category to view products.'}
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <li
                key={product.id}
                className="bg-white/50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                onClick={handleClick}
              >
                <h3 className="text-lg text-center font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="mt-2 w-full h-auto object-cover rounded-md"
                  />
                )}
                
                <p className="text-gray-900 text-lg"><span className='font-semibold'>Name: </span> {product.name}</p>
                <p className="text-gray-900 text-lg"><span className='font-semibold'>Type: </span> {product.type}</p>
                <p className="text-gray-900 text-lg"><span className='font-semibold'> Price: </span> ${product.basicPrice} </p>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}