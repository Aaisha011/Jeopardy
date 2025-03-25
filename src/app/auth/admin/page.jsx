"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Sun, Moon, Users, FileText, List, PenTool, LogOut, Trash2, ChartNoAxesGanttIcon, ShieldQuestionIcon,ChartBarStacked, Plus, ListFilterIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { signOut } from "next-auth/react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/signup");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch users.");
    }
  };

  // Delete User
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await axios.delete(`/api/signup?userId=${userId}`);
      if (response.status === 200) {
        setUsers(users.filter(user => user.id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user");
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
      await signOut({ callbackUrl: "/auth/login" });
      toast.success("User has logged out successfully");
    };

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-300 to-purple-600 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Sidebar */}

      <div className="w-64 bg-purple-600/50 shadow-md">
        <div className="p-5 text-center text-2xl font-semibold text-white pl-0">
          Admin Dashboard
        </div>
        <ul className="mt-5 space-y-2">
          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <Users className="mr-2" /> Users List
          </li>
          {/* <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <ChartBarStacked className="mr-2" /> 
            <Link href={''}>Create Question Category</Link>
          </li>
          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <ShieldQuestionIcon className="mr-2" /> 
            <Link href={''}>Add Questions</Link>
          </li> */}
          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <ChartNoAxesGanttIcon className="mr-2" /> 
            <Link href={'/auth/questionList'}>Questions List</Link>
          </li>

          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <FileText className="mr-2" /> 
            <Link href={'/auth/blog/category'}>Create Blog Category</Link>
          </li>
          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <PenTool className="mr-2" /> 
            <Link href={'/auth/blog/createBlog'}>Create Blog</Link>
          </li>
          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <List className="mr-2" /> 
            <Link href={'/auth/blog/blogList'}>Blog List</Link>
          </li>
          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <FileText className="mr-2" /> 
            <Link href={'/auth/store/category'}>Create Product Category</Link>
          </li>
          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <Plus className="mr-2" /> 
            <Link href={'/auth/store/createProduct'}>Add Product</Link>
          </li>
          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <ListFilterIcon className="mr-2" /> 
            <Link href={'/auth/store/productList'}>Product List</Link>
          </li>
          <li className="mt-65 w-[13vw] py-3 p-3 m-3 rounded-md flex items-center text-white bg-red-700 hover:bg-red-500 active:bg-red-900 cursor-pointer">
            <LogOut className="mr-2" /> 
            <button onClick={handleLogout}>Logout</button>
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
        <div className="p-6 rounded-lg border-2 border-white/30 shadow-lg shadow-gray-300">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/50 rounded-xl text-gray-800 dark:text-white text-center">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Role</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-red-700">
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
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition-all"
                        disabled={loading}
                      >
                        <Trash2 className="w-5 h-5 inline" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-red-700">
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
