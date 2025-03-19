// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();


// export async function POST(req) {
//   try {
//     const { userId, score } = await req.json();

//     // Validate userId
//     if (!userId) {
//       return NextResponse.json({ success: false, error: "User ID is required." }, { status: 400 });
//     }

//     // TODO: Validate user existence in database
//     const userExists = true; // Replace with actual DB check
//     if (!userExists) {
//       return NextResponse.json({ success: false, error: "User does not exist. Please provide a valid userId." }, { status: 404 });
//     }

//     // Simulate saving score
//     return NextResponse.json({ success: true, message: "Score submitted successfully!" }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
//   }
// }
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId, score } = await req.json();
    console.log(userId);
    

    // Validate input
    if (!userId || typeof score !== 'number') {
      return NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Save score to the database
    await prisma.score.create({
      data: {
        userId,
        score,
      },
    });

    return NextResponse.json({ success: true, message: 'Score submitted successfully!' });
    console.log('Score submitted successfully!');
  } 
  catch (error) {
    if (error.code === 'P2003') {
      // Foreign key constraint violation
      return NextResponse.json({ success: false, message: 'Foreign key constraint violation: Invalid userId' }, { status: 400 });
    }
    console.error('Error submitting score:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
