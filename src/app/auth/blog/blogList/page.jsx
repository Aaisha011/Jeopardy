"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  // Fetch Blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blog");
        setBlogs(response.data);
      } catch (err) {
        setError("Failed to fetch blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Delete Blog
  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete("/api/blog", { data: { id } });
      setBlogs(blogs.filter((blog) => blog.id !== id));
      toast.success("Blog has deleted successfully");
    } catch (err) {
      alert("Failed to delete blog.");
    }
  };

  // Update Blog (Redirect to Edit Page)
  const editBlog = (id) => {
    window.location.href = `/auth/blog/${id}/update`;
  };

  if (loading) return <p className="h-screen bg-purple-600 text-center text-xl p-11 text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gradient-to-r from-gray-300 to-purple-600 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-row">
      {/* Sidebar */}
      <div className="w-64 bg-purple-500 text-white shadow-md flex flex-col h-screen sticky left-0 top-0">
        <Sidebar />
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between ">
          <h1 className="text-3xl font-bold mb-4 p-7 text-center text-white">Blog List</h1>
          {/* <button className="flex justify-start">
            <a href="/auth/blog/createBlog" 
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition duration-200">

              <Plus className="text-white mr-2 " />
              Create Blog
            </a>
          </button> */}
          <Link
            href="/auth/blog/createBlog"
            className="bg-blue-500 text-white px-3 py-2 m-9 rounded-md flex items-center gap-2 hover:bg-blue-600 transition duration-200 h-10"
          >
            <Plus className="w-5 h-5" />
            Add Blog
          </Link>
        </div>

      <ul className="mt-4 p-5 ">
        {blogs.map((blog) => (
          <li key={blog.id} className="border p-4 mt-5 flex justify-between rounded-lg bg-white shadow-lg shadow-black">
            <div className="sm:flex sm:flex-row overflow-auto">
            </div>
            <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-52 object-cover m-7 rounded-md shadow-md shadow-gray-700"
                  
                />

            <div className="flex flex-col">
            <h2 className="text-xl font-semibold">{blog.title}</h2>

            <p className="text-gray-500">{blog.content}</p>

            <div className="flex flex-row items-center space-x-2 px-3 py-2">
                <button onClick={() => editBlog(blog.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 active:bg-green-700 cursor-pointer hover:scale-105">
                  Edit
                </button>
                <button onClick={() => deleteBlog(blog.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 active:bg-red-700 cursor-pointer hover:scale-105">
                  Delete
                </button>
            </div>
            </div>

          </li>
          
        ))}
      </ul>
      </div>
      </div>
    </div>
  );
}
