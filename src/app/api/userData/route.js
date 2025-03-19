import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    console.log("Fetching session...");
    const session = await getServerSession(authOptions);
    console.log("Session:", session);
    if (!session) {
      console.log("No session found.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    console.log("User Email:", userEmail);

    console.log("Fetching user and scores from database...");
    const userWithScores = await prisma.user.findUnique({
      where: { email: userEmail }, // Corrected variable here
      select: {
        id: true,
        name: true,
        email: true,
        scores: {
          select: { score: true },
          orderBy: { score: "desc" },
        },
      },
    });
    console.log("User with Scores:", userWithScores);

    if (!userWithScores) {
      console.log("User not found for email:", userEmail);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate total score from the scores array
    const scores = userWithScores.scores;
    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
    console.log("Total Score:", totalScore);

    return NextResponse.json(
      {
        user: {
          id: userWithScores.id,
          name: userWithScores.name,
          email: userWithScores.email,
        },
        scores,
        totalScore,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user data:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
