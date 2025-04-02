// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Modal from 'react-modal';
// import { ShoppingCart, ArrowLeft, ShoppingBasket } from 'lucide-react';
// import { useCart } from '@/context/cartContext';
// // import Navbar from '@/components/Navbar';
// import { toast, ToastContainer } from 'react-toastify';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';

// export default function Store() {
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [cart, setCart] = useState([]);
//   const { setCartCount } = useCart();
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   // Debug session data
//   useEffect(() => {
//     console.log("Session:", session);
//     console.log("User subscriptionType:", session?.user?.subscriptionType);
//     console.log("Status:", status);
//   }, [session, status]);

//   useEffect(() => {
//     const setModalAppElement = () => {
//       if (typeof window !== 'undefined') {
//         const appElement = document.getElementById('__next') || document.body;
//         if (appElement) {
//           Modal.setAppElement(appElement);
//         } else {
//           console.warn('No suitable app element found for react-modal. Retrying...');
//           setTimeout(setModalAppElement, 100);
//         }
//       }
//     };
//     setModalAppElement();
//   }, []);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get('/api/store/categories');
//         const categoriesArray = Array.isArray(response.data)
//           ? response.data
//           : response.data.categories || [];
//         setCategories(categoriesArray);
//       } catch (err) {
//         console.error('Error fetching categories:', err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const fetchProductsByCategory = async (categoryId) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`/api/store/products/byCategory?categoryId=${categoryId}`);
//       console.log("Fetched products:", response.data); // Debug product data
//       setProducts(response.data);
//     } catch (err) {
//       console.error('Error fetching products by category:', err);
//       setProducts([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchProductById = async (productId) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`/api/store/products/${productId}`);
//       console.log("Fetched selected product:", response.data); // Debug selected product
//       setSelectedProduct(response.data);
//       setIsModalOpen(true);
//     } catch (err) {
//       console.error('Error fetching product:', err);
//       setSelectedProduct(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getUserPrice = (product) => {
//     const subscriptionType = session?.user?.subscriptionType || 'free';
//     console.log(`Calculating price for product: ${product.name}, subscriptionType: ${subscriptionType}`);
//     switch (subscriptionType) {
//       case 'oneMonth\r\n':
//         return product.oneMonth || product.basicPrice; // Fallback if oneMonth is undefined
//       case 'sixMonth':
//         return product.sixMonth || product.basicPrice;
//       case 'lifetime':
//         return product.lifeTime || product.basicPrice;
//       case 'free':
//       default:
//         return product.basicPrice;
//     }
//   };

//   const getPriceLabel = () => {
//     const subscriptionType = session?.user?.subscriptionType || 'free';
//     switch (subscriptionType) {
//       case 'oneMonth\r\n':  // Change 'oneMonth' to match actual value
//         return '1-Month Price';
//       case 'sixMonth':
//         return '6-Month Price';
//       case 'lifeTime':
//         return 'Lifetime Price';
//       case 'free':
//       default:
//         return 'Basic Price';
//     }
//   };

//   const handleCategoryClick = (categoryId) => {
//     if (selectedCategory === categoryId) {
//       setSelectedCategory(null);
//       setProducts([]);
//       setSelectedProduct(null);
//       setIsModalOpen(false);
//     } else {
//       setSelectedCategory(categoryId);
//       fetchProductsByCategory(categoryId);
//       setSelectedProduct(null);
//       setIsModalOpen(false);
//     }
//   };

//   const handleClick = (productId) => {
//     fetchProductById(productId);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedProduct(null);
//   };

//   const addToCart = async (product) => {
//     if (status !== 'authenticated') {
//       toast.error('Please log in to add items to your cart');
//       return;
//     }

//     try {
//       const price = getUserPrice(product);
//       console.log(`Adding to cart: ${product.name} for $${price}`);

//       const response = await axios.post('/api/store/cart', {
//         productId: product.id,
//         quantity: 1,
//         price,
//       });

//       const updatedCart = response.data;
//       setCart(updatedCart);
//       setCartCount(updatedCart.length);
//       toast.success('Product added to cart');
//     } catch (error) {
//       console.error('Error adding to cart:', error.message);
//       toast.error('Failed to add product to cart');
//     }
//   };

//   const buyNow = (product) => {
//     const price = getUserPrice(product);
//     console.log(`Buying ${product.name} now for $${price}!`);
//     confirm(`Proceeding to buy ${product.name} for $${price}`);
//   };

//   useEffect(() => {
//     const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//     setCartCount(totalItems);
//   }, [cart, setCartCount]);

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-purple-600 to-gray-300 py-8 px-4 sm:px-6 lg:px-8">
//       <ToastContainer position="top-right" autoClose={3000} />
//       {/* <Navbar /> */}
//       <h1 className="text-3xl font-bold text-center text-white mb-8 mt-14">
//         Store Categories
//       </h1>

//       {categories.length === 0 ? (
//         <p className="text-center text-gray-500">No categories available.</p>
//       ) : (
//         <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
//           {categories.map((category) => (
//             <li
//               key={category.id}
//               onClick={() => handleCategoryClick(category.id)}
//               className={`bg-white/30 rounded-lg shadow-md shadow-black p-6 cursor-pointer ring-2 ring-white outline-none hover:shadow-lg transition-shadow duration-200 ${
//                 selectedCategory === category.id ? 'border-4 border-purple-900' : ''
//               }`}
//             >
//               <h2 className="text-xl text-center font-semibold text-gray-900 mb-2">
//                 {category.name}
//               </h2>
//               {category.description && (
//                 <p className="text-gray-600">{category.description}</p>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}

//       <div className="max-w-5xl mx-auto bg-none">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           {selectedCategory ? 'Products in Selected Category' : 'Select a Category'}
//         </h2>
//         {isLoading ? (
//           <p className="text-center text-gray-500">Loading products...</p>
//         ) : products.length === 0 ? (
//           <p className="text-center text-gray-500">
//             {selectedCategory ? 'No products found in this category.' : 'Please select a category to view products.'}
//           </p>
//         ) : (
//           <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {products.map((product) => (
//               <li
//                 key={product.id}
//                 className="bg-white/50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
//                 onClick={() => handleClick(product.id)}
//               >
//                 <h3 className="text-lg text-center font-semibold text-gray-900 mb-2">
//                   {product.name}
//                 </h3>
//                 {product.imageUrl && (
//                   <img
//                     src={product.imageUrl}
//                     alt={product.name}
//                     className="mt-2 w-full h-auto object-cover rounded-md"
//                   />
//                 )}
//                 <p className="text-gray-900 text-lg">
//                   <span className="font-semibold">Name: </span> {product.name}
//                 </p>
//                 <p className="text-gray-900 text-lg">
//                   <span className="font-semibold">Type: </span> {product.type}
//                 </p>
//                 <p className="text-gray-900 text-lg">
//                   <span className="font-semibold">Price: </span>
//                   <span className="line-through text-gray-500">${product.basicPrice}</span>{' '}
//                   <span className="text-green-600">${getUserPrice(product)}</span>
//                 </p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {selectedProduct && (
//         <Modal
//           isOpen={isModalOpen}
//           onRequestClose={closeModal}
//           className="bg-white/90 rounded-lg shadow-lg p-8 max-w-lg mx-auto mt-3"
//           overlayClassName="fixed inset-1 bg-purple-500 bg-opacity-50 flex justify-center items-center"
//         >
//           <button onClick={closeModal}>
//             <ArrowLeft />
//           </button>
//           <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
//             {selectedProduct.name}
//           </h3>
//           {selectedProduct.imageUrl && (
//             <div className="h-64 w-62 flex items-center justify-center p-1">
//               <img
//                 src={selectedProduct.imageUrl}
//                 alt={selectedProduct.name}
//                 className="w-full h-full object-cover rounded-md mb-4"
//               />
//             </div>
//           )}
//           <p className="text-gray-900 text-lg">
//             <span className="font-semibold">Description: </span>
//             {selectedProduct.description || 'No description available'}
//           </p>
//           <p className="text-gray-900 text-lg">
//             <span className="font-semibold">Type: </span> {selectedProduct.type}
//           </p>
//           <p className="text-gray-900 text-lg">
//             <span className="font-semibold">Basic Price: </span>
//             <span className="line-through text-gray-500">${selectedProduct.basicPrice}</span>
//           </p>
//           <p className="text-gray-900 text-lg">
//             <span className="font-semibold">{getPriceLabel()}: </span>
//             <span className="text-green-600">${getUserPrice(selectedProduct)}</span>
//           </p>

//           <div className="flex flex-row justify-around space-x-7">
//             <button
//               onClick={() => addToCart(selectedProduct)}
//               className="flex flex-row bg-green-700 px-5 py-3 rounded-sm mt-7 text-white gap-1 cursor-pointer hover:bg-green-500 active:bg-green-600 hover:scale-105"
//             >
//               <ShoppingCart />
//               Add to Cart
//             </button>
//             <button
//               onClick={() => buyNow(selectedProduct)}
//               className="flex flex-row bg-blue-700 px-5 py-3 rounded-sm mt-7 text-white gap-1 cursor-pointer hover:bg-blue-500 active:bg-blue-600 hover:scale-105"
//             >
//               <ShoppingBasket />
//               Buy Now
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }
//

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { ShoppingCart, ArrowLeft, ShoppingBasket } from "lucide-react";
import { useCart } from "@/context/cartContext";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Store() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [userPoints, setUserPoints] = useState(null);
  const { setCartCount } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Session:", session);
    console.log("User subscriptionType:", session?.user?.subscriptionType);
    console.log("Status:", status);
  }, [session, status]);

  useEffect(() => {
    const setModalAppElement = () => {
      if (typeof window !== "undefined") {
        const appElement = document.getElementById("__next") || document.body;
        if (appElement) {
          Modal.setAppElement(appElement);
        } else {
          console.warn("No suitable app element found for react-modal. Retrying...");
          setTimeout(setModalAppElement, 100);
        }
      }
    };
    setModalAppElement();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/store/categories");
        const categoriesArray = Array.isArray(response.data)
          ? response.data
          : response.data.categories || [];
        setCategories(categoriesArray);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const scoreResponse = await axios.get(`/api/scores?userId=${session.user.id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log("Fetched score data:", scoreResponse.data);
          let score = scoreResponse.data.success ? (scoreResponse.data.user?.totalScore ?? 0) : 0;
          setUserPoints(score);

          const cartResponse = await axios.get("/api/store/cart");
          console.log("Fetched cart data:", cartResponse.data);
          setCart(cartResponse.data);
          setCartCount(cartResponse.data.length);
        } catch (error) {
          console.error("Error fetching user data or cart:", error);
          setUserPoints(0);
        }
      }
    };
    fetchUserData();
  }, [status, session, setCartCount]);

  const fetchProductsByCategory = async (categoryId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/store/products/byCategory?categoryId=${categoryId}`);
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products by category:", err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductById = async (productId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/store/products/${productId}`);
      setSelectedProduct(response.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching product:", err);
      setSelectedProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserPrice = (product) => {
    const subscriptionType = session?.user?.subscriptionType?.trim() || "free";
    switch (subscriptionType) {
      case "oneMonth":
        return product.oneMonth || product.basicPrice;
      case "sixMonth":
        return product.sixMonth || product.basicPrice;
      case "lifeTime":
        return product.lifeTime || product.basicPrice;
      case "free":
      default:
        return product.basicPrice;
    }
  };

  const getPriceLabel = () => {
    const subscriptionType = session?.user?.subscriptionType?.trim() || "free";
    switch (subscriptionType) {
      case "oneMonth":
        return "1-Month Price";
      case "sixMonth":
        return "6-Month Price";
      case "lifeTime":
        return "Lifetime Price";
      case "free":
      default:
        return "Basic Price";
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setProducts([]);
      setSelectedProduct(null);
      setIsModalOpen(false);
    } else {
      setSelectedCategory(categoryId);
      fetchProductsByCategory(categoryId);
      setSelectedProduct(null);
      setIsModalOpen(false);
    }
  };

  const handleClick = (productId) => {
    fetchProductById(productId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const addToCart = async (product) => {
    if (status !== "authenticated") {
      toast.error("Please log in to add items to your cart");
      return;
    }
    try {
      const price = getUserPrice(product);
      const response = await axios.post("/api/store/cart", {
        productId: product.id,
        quantity: 1,
        price,
      });
      const updatedCart = response.data;
      setCart(updatedCart);
      setCartCount(updatedCart.length);
      toast.success("Product added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      toast.error("Failed to add product to cart");
    }
  };

  const buyNow = async (product) => {
    if (status !== "authenticated") {
      toast.error("Please log in to make a purchase");
      return;
    }
    const price = getUserPrice(product);
    const confirmed = window.confirm(
      `Proceeding to buy ${product.name} for ${price} points? Current points: ${userPoints || 0}`
    );
    if (!confirmed) return;

    try {
      const response = await axios.post("/api/store/purchase", {
        productId: product.id,
        price,
      });
      console.log("Purchase response:", response.data); // Debug log
      if (response.status === 200) {
        const newPoints = response.data.points; // Expecting 'points' from /api/store/purchase
        console.log("New points after purchase:", newPoints); // Debug log
        setUserPoints(newPoints); // Update local state
        toast.success(`Purchased ${product.name} for ${price} points! New points: ${newPoints}`);
        closeModal();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Purchase failed";
      console.error("Purchase error:", error.response?.data || error.message); // Debug log
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  }, [cart, setCartCount]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-600 to-gray-300">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main Content */}
      <main className="flex-1">
        <h1 className="text-3xl font-bold text-center text-white mb-8 mt-14">
          Store Categories
        </h1>

        {userPoints !== null && (
          <p className="text-center text-white mb-6">Your Points: {userPoints}</p>
        )}

        {categories.length === 0 ? (
          <p className="text-center text-gray-500">No categories available.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8 px-4">
            {categories.map((category) => (
              <li
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`bg-white/30 rounded-lg shadow-md shadow-black p-6 cursor-pointer ring-2 ring-white outline-none hover:shadow-lg transition-shadow duration-200 ${
                  selectedCategory === category.id ? "border-4 border-purple-900" : ""
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

        <div className="max-w-5xl mx-auto bg-none px-4 mb-7">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {selectedCategory ? "Products in Selected Category" : "Select a Category"}
          </h2>
          {isLoading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">
              {selectedCategory
                ? "No products found in this category."
                : "Please select a category to view products."}
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="bg-white/50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleClick(product.id)}
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
                  <p className="text-gray-900 text-lg">
                    <span className="font-semibold">Name: </span> {product.name}
                  </p>
                  <p className="text-gray-900 text-lg">
                    <span className="font-semibold">Type: </span> {product.type}
                  </p>
                  <p className="text-gray-900 text-lg">
                    <span className="font-semibold">Price: </span>
                    <span className="line-through text-gray-500">${product.basicPrice}</span>{" "}
                    <span className="text-green-600">${getUserPrice(product)}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedProduct && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            className="bg-white/90 rounded-lg shadow-lg p-8 max-w-lg mx-auto mt-3"
            overlayClassName="fixed inset-1 bg-purple-500 bg-opacity-50 flex justify-center items-center"
          >
            <button onClick={closeModal}>
              <ArrowLeft />
            </button>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              {selectedProduct.name}
            </h3>
            {selectedProduct.imageUrl && (
              <div className="h-64 w-62 flex items-center justify-center p-1">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover rounded-md mb-4"
                />
              </div>
            )}
            <p className="text-gray-900 text-lg">
              <span className="font-semibold">Description: </span>
              {selectedProduct.description || "No description available"}
            </p>
            <p className="text-gray-900 text-lg">
              <span className="font-semibold">Type: </span> {selectedProduct.type}
            </p>
            <p className="text-gray-900 text-lg">
              <span className="font-semibold">Basic Price: </span>
              <span className="line-through text-gray-500">${selectedProduct.basicPrice}</span>
            </p>
            <p className="text-gray-900 text-lg">
              <span className="font-semibold">{getPriceLabel()}: </span>
              <span className="text-green-600">${getUserPrice(selectedProduct)}</span>
            </p>
            <div className="flex flex-row justify-around space-x-7">
              <button
                onClick={() => addToCart(selectedProduct)}
                className="flex flex-row bg-green-700 px-5 py-3 rounded-sm mt-7 text-white gap-1 cursor-pointer hover:bg-green-500 active:bg-green-600 hover:scale-105"
              >
                <ShoppingCart />
                Add to Cart
              </button>
              <button
                onClick={() => buyNow(selectedProduct)}
                className="flex flex-row bg-blue-700 px-5 py-3 rounded-sm mt-7 text-white gap-1 cursor-pointer hover:bg-blue-500 active:bg-blue-600 hover:scale-105"
              >
                <ShoppingBasket />
                Buy Now
              </button>
            </div>
          </Modal>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}