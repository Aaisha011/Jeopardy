// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { PrismaClient } from "@prisma/client";
// import jwt from "jsonwebtoken";

// // Initialize Prisma Client (use singleton for better performance in production)
// const prisma = global.prisma || new PrismaClient();
// if (process.env.NODE_ENV === "development") global.prisma = prisma;

// export async function POST(req) {
//   try {
//     // Parse email and password from the request body
//     const { email, password } = await req.json();

//     // Validate input
//     if (!email || !password) {
//       return NextResponse.json(
//         { message: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Fetch the user from the database
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     // Check if user exists
//     if (!user) {
//       return NextResponse.json(
//         { message: "Invalid email or password" }, 
//         { status: 401 }
//       );
//     }

//     // Validate the password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { message: "Invalid email or password" },
//         { status: 401 }
//       );
//     }

//     // Check if JWT_SECRET is defined
//     if (!process.env.JWT_SECRET) {
//       throw new Error("JWT_SECRET is not defined in your environment");
//     }

//     // Generate a JWT token
//     const token = jwt.sign(
//       { id: user.id, role: user.role }, // Payload (user info)
//       process.env.JWT_SECRET, // Secret key from .env
//       { expiresIn: "1h" } // Token expiry
//     );

//     // Return a success response with the token
//     return NextResponse.json({
//       message: "Login successful",
//       user: { id: user.id, email: user.email, name: user.name, role: user.role },
//       token, // Include the generated token
//     });
//   } catch (error) {
//     // Handle unexpected errors
//     console.error("Login error:", error.message);
//     return NextResponse.json(
//       { message: "Something went wrong. Please try again." },
//       { status: 500 }
//     );
//   }
// }
