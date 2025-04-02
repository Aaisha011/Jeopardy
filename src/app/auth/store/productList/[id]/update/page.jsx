"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    basicPrice: "",
    oneMonth: "",
    sixMonth: "",
    lifeTime: "",
    categoryId: "",
    imageUrl: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/store/products/${id}`);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          type: data.type || "",
          basicPrice: data.basicPrice.toString() || "",
          oneMonth: data.oneMonth.toString() || "",
          sixMonth: data.sixMonth.toString() || "",
          lifeTime: data.lifeTime.toString() || "",
          categoryId: data.categoryId || "",
          imageUrl: data.imageUrl || "",
          image: null,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details.");
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/store/categories`);
        setCategories(data.categories || data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories.");
      }
    };

    if (id) {
      fetchProduct();
      fetchCategories();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    const productData = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      basicPrice: formData.basicPrice,
      oneMonth: formData.oneMonth,
      sixMonth: formData.sixMonth,
      lifeTime: formData.lifeTime,
      categoryId: formData.categoryId,
      imageUrl: formData.imageUrl,
    };

    formDataToSend.append("product", JSON.stringify(productData));
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await axios.put(`/api/store/products/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully!");
      router.push("/auth/store/productList");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(`Failed to update product: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg m-32 shadow-lg shadow-black bg-amber-100/30">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-center text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Type product name here"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full p-2 border rounded"
        />
        <select
          name="type"
          value={formData.type || ""}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="" disabled>Select Product Type</option>
          <option value="physical">Physical</option>
          <option value="digital">Digital</option>
        </select>

        <input
          type="number"
          name="basicPrice"
          value={formData.basicPrice}
          onChange={handleChange}
          placeholder="Basic price"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="oneMonth"
          value={formData.oneMonth}
          onChange={handleChange}
          placeholder="One Month price"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="sixMonth"
          value={formData.sixMonth}
          onChange={handleChange}
          placeholder="Six Month price"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="lifeTime"
          value={formData.lifeTime}
          onChange={handleChange}
          placeholder="Life Time price"
          required
          className="w-full p-2 border rounded"
        />        
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="" disabled>Select a category</option>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))
          ) : (
            <option disabled>Loading categories...</option>
          )}
        </select>

        {formData.imageUrl && (
          <div className="mb-2">
            <img
              src={formData.imageUrl}
              alt="Current product"
              className="h-32 w-32 object-cover rounded"
            />
          </div>
        )}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}