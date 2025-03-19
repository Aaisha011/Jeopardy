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




// GET: Fetch all users with their total scores

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    console.log("Fetching total score for user:", userId);

    const userWithScores = await prisma.user.findUnique({
      where: { id: userId }, // Ensure ID type matches DB schema
      select: {
        id: true,
        name: true,
        email: true,
        scores: {
          select: { score: true },
        },
      },
    });

    if (!userWithScores) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Calculate total score
    const totalScore = userWithScores.scores.reduce((sum, entry) => sum + entry.score, 0);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: userWithScores.id,
          name: userWithScores.name,
          email: userWithScores.email,
          totalScore,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user scores:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

