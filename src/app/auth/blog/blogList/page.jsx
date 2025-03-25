"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="  bg-gradient-to-r from-purple-600 to-purple-300">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-4 p-7 text-center text-white">Blog List</h1>
      <a href="/auth/blog/createBlog" className="bg-blue-500 text-white px-7 py-2 rounded p-3 ml-5 inline-flex items-center">
        <Plus className="text-white mr-2 o-5" />
        Create Blog
      </a>

      <ul className="mt-4 p-5 ">
        {blogs.map((blog) => (
          <li key={blog.id} className="border p-4 mt-5 flex justify-between rounded-lg bg-white shadow-lg shadow-black">
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
  );
}
