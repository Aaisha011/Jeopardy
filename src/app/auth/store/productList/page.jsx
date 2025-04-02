"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CloudRain, Plus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch Products and Categories from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/store/products");
        if (response.data.success && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          setProducts(response.data); // Fallback for direct array response
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/api/store/categories`);
        if (response.data.success && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else {
          setCategories(response.data); // Fallback if structure differs
        }
      } catch (err) {
        console.error("Error while fetching categories:", err);
        toast.error("Failed to fetch categories.");
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`/api/store/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product.");
    }
  };

  // Update product (Redirect to Edit Page)
  const editProduct = (id) => {
    window.location.href = `/auth/store/productList/${id}/update`;
  };

  // Helper function to get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  if (loading)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-gray-300 to-purple-600">
        <p className="text-xl text-white">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-gray-300 to-purple-600">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-r from-gray-300 to-purple-600">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full bg-purple-500 text-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Product List</h1>
          <Link
            href="/auth/store/createProduct"
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border-4 border-purple-900 rounded-lg shadow-lg shadow-black flex flex-col p-4 transition-transform hover:scale-[1.02]"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-md mb-4 shadow-md shadow-gray-700"
                />
                <div className="flex flex-col flex-1">
                  <h2 className="text-lg font-semibold">
                    <span className="text-purple-900">Name:</span> {product.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    <span className="text-purple-900 font-semibold">Description:</span>{" "}
                    {product.description}
                  </p>
                  <p className="text-gray-800 mt-1">
                    <span className="text-purple-900 font-semibold">Basic Price:</span> $
                    {product.basicPrice}
                  </p>
                  <p className="text-gray-800 mt-1">
                    <span className="text-purple-900 font-semibold">One Month Price:</span> $
                    {product.oneMonth}
                  </p>
                  <p className="text-gray-800 mt-1">
                    <span className="text-purple-900 font-semibold">Six Month Price:</span> $
                    {product.sixMonth}
                  </p>
                  <p className="text-gray-800 mt-1">
                    <span className="text-purple-900 font-semibold">Life Time Price:</span> $
                    {product.lifeTime}
                  </p>
                  <p className="text-gray-800 mt-1">
                    <span className="text-purple-900 font-semibold">Category: </span>
                    {getCategoryName(product.categoryId)}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => editProduct(product.id)}
                    className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 active:bg-green-700 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 active:bg-red-700 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white">No products available.</p>
        )}
      </div>
    </div>
  );
}