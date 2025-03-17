"use client";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ContactForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/api/sendEmail", formData);

      if (data.success) {
        toast.success("Email sent successfully! ✅");
        setFormData({ name: "", email: "", message: "" });
        console.log(setFormData);
        router.push('/auth/user');
      } 
      else {
        toast.error(data.error || "Failed to send email ");
      }
    } catch (error) {
      toast.error("An error occurred, please try again. ");
    }

    setLoading(false);
  };

  return (
    <div className="h-[100vh] bg-gradient-to-r from-purple-500 to-gray-300">   
      <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-lg shadow-black bg-white">
        <Toaster position="top-right" reverseOrder={false} />
        <h2 className="text-2xl font-bold mb-4 ">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="w-full p-2 border rounded" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="w-full p-2 border rounded" />
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" required className="w-full p-2 border rounded"></textarea>
          <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
       </div>
    </div>
  );
}
