import React from 'react'
import { Sun, Moon, Users, FileText, List, PenTool, LogOut, Trash2, ChartNoAxesGanttIcon, ShieldQuestionIcon,ChartBarStacked, Plus, ListFilterIcon } from "lucide-react";
import Link from 'next/link';
import { signOut } from 'next-auth/react';


function Sidebar() {
    // Handle Logout
      const handleLogout = async () => {
          await signOut({ callbackUrl: "/auth/login" });
          toast.success("User has logged out successfully");
        };
  return (
    <div>
      <div className=" min-h-screen w-64 bg-purple-600/30 shadow-md overflow-auto">
        <div className="p-5 text-center text-2xl font-semibold text-white pl-0">
          Admin Dashboard
        </div>
        <ul className="mt-5 space-y-2">
          <li className="px-4 py-2 flex items-center text-white hover:bg-purple-300 cursor-pointer">
            <Users className="mr-2" />
            <Link href={'/auth/admin'}>Users List</Link>
            
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
          <li className="mt-48 w-[13vw] py-3 p-3 m-3 rounded-md flex items-center text-white bg-red-700 hover:bg-red-500 active:bg-red-900 cursor-pointer">
            <LogOut className="mr-2" /> 
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
