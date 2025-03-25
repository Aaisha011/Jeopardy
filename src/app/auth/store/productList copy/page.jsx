"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { toast ,ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";


export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const param = useParams();
  

  // Fetch Product from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/api/store/products`);
        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete("/api/store/products/${id}", { data: { id } });
      setProducts(products.filter((data) => data.id !== id));
      toast.success("Product has deleted successfully");
    } catch (err) {
      alert("Failed to delete product.");
      console.log("Error:",err);
    }
  };

// Update product (Redirect to Edit Page)
  const editProduct = (id) => {
    window.location.href = `/auth/store/productList/${id}/update`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-screen bg-gradient-to-r from-purple-600 to-purple-300">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-4 p-7 text-center text-white">Product List</h1>
      <a href="/auth/store/createProducts" className="bg-blue-500 text-white px-7 py-2 rounded p-3 ml-5 inline-flex items-center">
        <Plus className="text-white mr-2 o-5" />
        Add Product
      </a>

      <ul className="mt-4 p-5 flex flex-row gap-7">
        {products.map((data) => (
            
          <li key={data.id} className="border w-80 p-4 mt-5 flex flex-col justify-between rounded-lg bg-white shadow-lg shadow-black">
                <img
                      src={data.imageUrl}
                      alt={data.name}
                      className="w-52 h-52 object-cover m-7 rounded-md shadow-md shadow-gray-700"
                      
                    />
    
                <div className="flex flex-col">
                    <h2><span className="text-xl font-semibold">Name: </span> {data.name}</h2>
        
                    <p><span className="text-xl font-semibold">Description: </span>{data.description}</p>
                    <p><span className="text-xl font-semibold">Price: </span>{data.basicPrice}</p>
        
                    <div className="flex flex-row items-center space-x-2 px-3 py-2">
                        <button onClick={() => editProduct(data.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 active:bg-green-700 cursor-pointer hover:scale-105">
                          Edit
                        </button>
                        <button onClick={() => deleteProduct(data.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 active:bg-red-700 cursor-pointer hover:scale-105">
                          Delete
                        </button>
                    </div>
                </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
