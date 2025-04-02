"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function CategoryComponent() {

  const router = useRouter();
  const [categories, setCategories] = useState([]); // To store categories
  const [newCategory, setNewCategory] = useState(""); // For creating a new category
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/category"); // API call to fetch categories
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory) {
      alert("Category name cannot be empty!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/category", {
        name: newCategory,
      });
      setCategories([...categories, response.data]); // Add new category to state
      setNewCategory(""); // Reset input field
      alert("Category created successfully!");
      router.push("/auth/admin");
    } catch (error) {
      console.error("Failed to create category:", error);
      alert("Failed to create category.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await axios.delete(`/api/category`, { data: { id } }); // API call to delete category
      setCategories(categories.filter((category) => category.id !== id)); // Update state
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="flex items-center h-screen  bg-gradient-to-r from-gray-300 to-purple-600 dark:bg-gray-900">
      {/* Sidebar */}
    <div className="w-64 bg-purple-500 text-white shadow-md flex flex-col h-full">
      <Sidebar />
    </div>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-7">
      <h2 className="text-2xl font-bold mb-4 text-purple-900 text-center">Manage Blog Categories</h2>

      {/* Create Category Form */}
      <form onSubmit={handleCreateCategory} className="mb-6">
        <input
          type="text"
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 cursor-pointer transition disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Category"}
        </button>
      </form>

      {/* Existing Categories List */}
      <ul className="space-y-4">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex justify-between items-center p-2 border rounded-lg"
          >
            <span>{category.name}</span>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="text-red-500 font-bold hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* No Categories Message */}
      {categories.length === 0 && (
        <p className="text-gray-500 mt-4">No categories found.</p>
      )}
    </div>
    </div>

  );
}
