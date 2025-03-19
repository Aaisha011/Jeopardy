"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditBlog({ params }) {
  const router = useRouter();
  const { id } = params; // Get the blog ID from the URL

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch blog details and categories when the page loads
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/api/blog/${id}`);
        setFormData({
          title: data.title || "",
          content: data.content || "",
          imageUrl: data.imageUrl || "",
          category: data.category?._id || "", // Storing category ID
        });
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    if (id) fetchBlog();

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/category`);
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for updating blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`/api/blog/${id}`, formData);
      toast.success("Blog updated successfully!");
      router.push("/auth/blog"); // Redirect to blog list page
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg m-32 shadow-lg shadow-black bg-amber-100/30">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-center text-2xl font-bold mb-4">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Content"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          required
          className="w-full p-2 border rounded"
        />
        {/* Category Dropdown */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}
