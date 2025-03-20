import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, token, password } = await request.json();

    // Fetch user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: { not: null }, // Ensure token exists
        resetTokenExpires: { gt: new Date() }, // Ensure token is not expired
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired reset token" }),
        { status: 400 }
      );
    }

    // Validate token
    const isTokenValid = await bcrypt.compare(token, user.resetToken);
    if (!isTokenValid) {
      return new Response(
        JSON.stringify({ message: "Invalid reset token" }),
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update only the password first
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    // Then clear reset token (ensure previous update works)
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return new Response(
      JSON.stringify({ message: "Password reset successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}
