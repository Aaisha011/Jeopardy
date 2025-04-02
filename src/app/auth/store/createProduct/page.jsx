"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      type: "",
      basicPrice: "",
      oneMonth: "",
      sixMonth: "",
      lifeTime: "",
      categoryId: "",
      image: null,
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/store/categories");
      const categoriesData = Array.isArray(response.data)
        ? response.data
        : response.data.categories || [];
      setCategories(categoriesData);
    } catch (error) {
      toast.error(
        "Failed to fetch categories: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();

    // Create a single product object and stringify it
    const productData = {
      name: data.name,
      description: data.description || "",
      type: data.type,
      basicPrice: String(data.basicPrice),
      oneMonth: String(data.oneMonth),
      sixMonth: String(data.sixMonth),
      lifeTime: String(data.lifeTime),
      categoryId: data.categoryId,
    };
    formData.append("product", JSON.stringify(productData)); // Single product field

    // Append image if provided
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const response = await axios.post("/api/store/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product added successfully!");
      reset();
      document.getElementById("image").value = "";
      router.push("/auth/store/productList");
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(`Failed to add product: ${errorMessage}`);
      console.log(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-300 to-purple-600 dark:bg-gray-900 ">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-row">
      {/* Sidebar */}
      <div className="w-64 bg-purple-500 text-white shadow-md flex flex-col h-screen fixed left-0 top-0">
        <Sidebar />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-center text-purple-900 mb-6">
            Add New Product
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name", { required: "Product name is required" })}
                placeholder="Enter product name"
                className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                {...register("description")}
                placeholder="Enter product description"
                rows="4"
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Product Type
              </label>
              <select
                id="type"
                {...register("type", { required: "Product type is required" })}
                className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 ${
                  errors.type ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select type</option>
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="basicPrice" className="block text-sm font-medium text-gray-700">
                Basic Price (Points)
              </label>
              <input
                type="number"
                id="basicPrice"
                step="1"
                {...register("basicPrice", {
                  required: "Basic price is required",
                  min: { value: 0, message: "Price must be positive" },
                  valueAsNumber: true,
                })}
                placeholder="300"
                className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 ${
                  errors.basicPrice ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.basicPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.basicPrice.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="oneMonth" className="block text-sm font-medium text-gray-700">
                1-Month Price (Points)
              </label>
              <input
                type="number"
                id="oneMonth"
                step="1"
                {...register("oneMonth", {
                  required: "1-month price is required",
                  min: { value: 0, message: "Price must be positive" },
                  valueAsNumber: true,
                })}
                placeholder="250"
                className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 ${
                  errors.oneMonth ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.oneMonth && (
                <p className="mt-1 text-sm text-red-600">{errors.oneMonth.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="sixMonth" className="block text-sm font-medium text-gray-700">
                6-Month Price (Points)
              </label>
              <input
                type="number"
                id="sixMonth"
                step="1"
                {...register("sixMonth", {
                  required: "6-month price is required",
                  min: { value: 0, message: "Price must be positive" },
                  valueAsNumber: true,
                })}
                placeholder="200"
                className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 ${
                  errors.sixMonth ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.sixMonth && (
                <p className="mt-1 text-sm text-red-600">{errors.sixMonth.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lifeTime" className="block text-sm font-medium text-gray-700">
                Lifetime Price (Points)
              </label>
              <input
                type="number"
                id="lifeTime"
                step="1"
                {...register("lifeTime", {
                  required: "Lifetime price is required",
                  min: { value: 0, message: "Price must be positive" },
                  valueAsNumber: true,
                })}
                placeholder="150"
                className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 ${
                  errors.lifeTime ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.lifeTime && (
                <p className="mt-1 text-sm text-red-600">{errors.lifeTime.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="categoryId"
                {...register("categoryId", { required: "Category is required" })}
                className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 ${
                  errors.categoryId ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isSubmitting || categories.length === 0}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                {...register("image", { required: "Image is required" })}
                className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-md shadow-sm text-gray-900 ${
                  errors.image ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}