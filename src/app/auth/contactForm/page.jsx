"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "@/utils/validationSchema";

export default function ContactForm() {
  const router = useRouter();
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data) => {
    if (!captchaValue) {
      toast.error("CAPTCHA verification failed!");
      return;
    }
    setLoading(true);
    try {
      // Optionally verify CAPTCHA with your backend
      const captchaResponse = await axios.post("/api/verify-captcha", { captcha: captchaValue });
      if (!captchaResponse.data.success) {
        toast.error("CAPTCHA verification failed!");
        setLoading(false);
        return;
      }
      // Combine the form data with the CAPTCHA token if needed by your backend
      const payload = { ...data, captcha: captchaValue };

      // Send email with validated form data
      const { data: emailData } = await axios.post("/api/sendEmail", payload);
      if (emailData.success) {
        toast.success("Email sent successfully! ✅");
        reset();
        router.push("/auth/user");
      } else {
        toast.error(emailData.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      toast.error("An error occurred, please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="h-[100vh] bg-gradient-to-r from-purple-500 to-gray-300 flex items-center justify-center">
      <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-lg bg-white">
        <Toaster position="top-right" reverseOrder={false} />
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              {...register("name")}
              placeholder="Your Name"
              className="w-full p-2 border rounded"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input
              type="email"
              {...register("email")}
              placeholder="Your Email"
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <textarea
              {...register("message")}
              placeholder="Your Message"
              className="w-full p-2 border rounded"
            ></textarea>
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
          </div>
          {/* Google reCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={(value) => setCaptchaValue(value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white w-full px-4 py-2 rounded"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
