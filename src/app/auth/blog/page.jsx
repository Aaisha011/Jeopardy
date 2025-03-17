"use client";

import Link from 'next/link';
import { useState , useEffect} from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get('/api/blog').then((response) => setBlogs(response.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Latest Blogs</h1>
      {blogs.length === 0 ? (
        <p className="text-gray-500 text-center">No blogs available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/auth/blog/${blog.id}`} legacyBehavior>
              <a className="block bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{blog.title}</h2>
                  <p className="text-gray-600 mt-2 line-clamp-3">{blog.content}</p>
                  <span className="mt-4 inline-block bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
                    {blog.category?.name || 'Uncategorized'}
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
