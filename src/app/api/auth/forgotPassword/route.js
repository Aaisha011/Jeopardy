import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Email not found" }, { status: 400 });
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substr(2, 10);
    const salt = await bcrypt.genSalt(10);
    const resetTokenHash = await bcrypt.hash(resetToken, salt);
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token and expiry
    await prisma.user.update({
      where: { email },
      data: { resetToken: resetTokenHash, resetTokenExpires: expires },
    });

    // Construct reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/password/resetPassword?token=${resetToken}&email=${email}`;
    console.log("Generated Reset Link:", resetLink);

    // Send email using Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { email: process.env.BREVO_EMAIL, name: "Your App Name" },
        to: [{ email }],
        subject: "Password Reset Request",
        htmlContent: `<p>Click this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    return NextResponse.json({ message: "Reset link sent to your email" }, { status: 200 });
  } catch (error) {
    console.error("Error in forgot-password API:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}