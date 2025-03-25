"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function CreateBlog() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    categoryId: '',
  });
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    axios.get('/api/category').then((response) => setCategories(response.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/blog', formData);
      toast.success('Blog created successfully!');
      router.push("/auth/blog");
    } catch (error) {
      console.error(error);
      toast.error('Failed to create blog.');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    try {
      const response = await axios.post('/api/category', { name: newCategory });
      setCategories([...categories, response.data]);
      setNewCategory("");
      toast.success("Category added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category.");
    }
  };

  return (
    <div className='h-screen bg-gradient-to-r from-purple-600 to-gray-300'>
      <ToastContainer position="top-right" autoClose={3000} />

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-lg shadow-black rounded-lg p-7 space-y-3.5">
        <div>
        <h1 className='text-center p-5 text-purple-900 font-bold text-3xl'>Create Blog Form</h1>

          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input id="title" type="text" placeholder="Enter blog title" value={formData.title}
           onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea id="content" placeholder="Write your blog content here" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required rows="5" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"></textarea>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input id="image" type="text" placeholder="Paste image URL" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select id="category" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none">
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        {/* Add Category Feature */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Add New Category</label>
          <div className="flex space-x-2">
            <input type="text" placeholder="Enter category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
            <button type="button" onClick={handleAddCategory} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Add</button>
          </div>
        </div>

        <div>
          <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 cursor-pointer">Create Blog</button>
        </div>
      </form>
    </div>
  );
} 