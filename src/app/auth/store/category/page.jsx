"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast,ToastContainer } from "react-toastify";
import Sidebar from "@/components/Sidebar";

export default function ProductCategory() {
  const router = useRouter();
  const [categories, setCategories] = useState([]); // To store categories
  const [newCategory, setNewCategory] = useState(""); // For creating a new category
  const [isLoading, setIsLoading] = useState(false); // For create/delete actions
  const [isFetching, setIsFetching] = useState(true); // For initial fetch

  // Fetch existing categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get("/api/store/categories"); // Adjusted to match your API
      setCategories(response.data.categories || response.data); // Handle different response structures
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      alert("Failed to fetch categories: " + (error.response?.data?.error || error.message));
    } finally {
      setIsFetching(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/store/categories", { name: newCategory });
      setCategories([...categories, response.data.category || response.data]); // Adjust based on API response
      setNewCategory(""); // Reset input field
      toast.success("Category has created successfully");
      // router.push("/auth/admin"); // Redirect to admin page
    } catch (error) {
      console.error("Failed to create category:", error);
      alert("Failed to create category: " + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.delete("/api/store/categories", { data: { id } }); // Send id in body as per your DELETE API
      setCategories(categories.filter((category) => category.id !== id)); // Update state
      toast.success("Category has deleted successfully!");
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Error delete category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center h-screen bg-gradient-to-r from-gray-300 to-purple-600 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      <Sidebar/>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-7">
        <h2 className="text-2xl font-bold mb-4 text-purple-900 text-center">Manage Product Categories</h2>

        {/* Create Category Form */}
        <form onSubmit={handleCreateCategory} className="mb-6">
          <input
            type="text"
            placeholder="Enter category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Category"}
          </button>
        </form>

        {/* Existing Categories List */}
        {isFetching ? (
          <p className="text-gray-500 text-center">Loading categories...</p>
        ) : categories.length > 0 ? (
          <ul className="space-y-4">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex justify-between items-center p-2 border rounded-lg"
              >
                <span>{category.name}</span>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 font-bold hover:text-red-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No categories found.</p>
        )}
      </div>
    </div>
  );
}