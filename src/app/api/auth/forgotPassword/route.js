import prisma from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";
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
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token and expiry
    await prisma.user.update({
      where: { email },
      data: { resetToken: resetTokenHash, resetTokenExpires: expires },
    });

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // False for 587, true for 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: true, // Enforce TLS
      },
    });

    // Construct reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/resetPassword?token=${resetToken}&email=${email}`;
    console.log("Generated Reset Link:", resetLink);

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Click this link to reset your password: ${resetLink}`,
    });

    return NextResponse.json({ message: "Reset link sent to your email" }, { status: 200 });
  } catch (error) {
    console.error("Error in forgot-password API:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
