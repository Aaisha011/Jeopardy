"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function BlogDetail() {
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blog/${id}`);
        setBlog(response.data);
      } catch (err) {
        setError("Blog not found");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mt-6 mb-6">{blog.title}</h1>
      <img
        src={blog.imageUrl}
        alt={blog.title}
        className="w-full h-64 object-cover rounded-lg shadow-md"
      />
      <span className="mt-4 inline-block bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
        {blog.category?.name || "Uncategorized"}
      </span>
      <p className="text-gray-600 mt-4">{blog.content}</p>
      
      {/* <Link key={blog.id} href={`/auth/blog/${blog.id}/update`} legacyBehavior>
        <a className="bg-green-500 text-white px-3 py-1 rounded mt-2 inline-block">Edit</a>
      </Link> */}

    </div>
  );
}
