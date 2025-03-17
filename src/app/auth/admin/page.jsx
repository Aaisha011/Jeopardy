"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Sun, Moon, Users, LogOut, createLucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null); // Add error state
  const router = useRouter();

  

  useEffect(() => {
    

  const fetchUsers = async () => {
    try {
      let { data: User, error } = await supabase.from('users').select('*');

      if (error) {
        console.error("Supabase Error:", error);
        setError(error.message);
        return;
      }

      console.log("Fetched Users:", User);
      setUsers(User || []);
    } catch (err) {
      setError('Unexpected error occurred.');
      console.error('Unexpected error:', err);
    }
  };

  fetchUsers();
}, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    alert("Logout successfully");
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-300 to-purple-600 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-purple-600/50 shadow-md">
        <div className="p-5 text-center text-2xl font-semibold text-white pl-0">
          Admin Dashboard
        </div>
        <ul className="mt-5 space-y-2">
          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <Users className="mr-2" /> Users List
          </li>

          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <Users className="mr-2" /> 
            <Link href={'/auth/blog/category'}>Create Category</Link>
          </li>

          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <Users className="mr-2" /> 
            <Link href={'/auth/blog/createBlog'}>Create Blog</Link>
          </li>

          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <Users className="mr-2" /> 
            <Link href={'/auth/blog/blogList'}>Blog List</Link>

          </li>
      
          <li className="mt-92 w-[13vw] py-2 p-3 m-3 rounded-md flex items-center text-white bg-red-700 hover:bg-red-500 active:bg-red-900 cursor-pointer">
            <LogOut className="mr-2" /> <button onClick={handleLogout}>Logout</button>
          </li>
          
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Users List</h1>
        </div>

        {/* Users Table */}
        <div className="p-6 rounded-lg border-2 border-white/30 shadow-lg shadow-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/50 rounded-xl text-gray-800 dark:text-white text-center">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-red-700">
                    {error}
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id} className="border-b dark:border-gray-700 text-white">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-red-700">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


