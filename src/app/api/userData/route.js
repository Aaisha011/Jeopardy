import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    console.log("Fetching session...");
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session || !session.user) {
      console.log("No session found.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    console.log("User Email:", userEmail);

    console.log("Fetching user from database...");
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      console.log("User not found for email:", userEmail);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Fetching scores from database...");
    const scores = await prisma.score.findMany({
      where: { userId: user.id }, // Ensure `userId` matches the user's ID
      select: { score: true },
      orderBy: { score: "desc" },
    });

    console.log("Scores:", scores);

    // Calculate total score
    const totalScore = scores.reduce((sum, entry) => sum + entry.score, 0);
    console.log("Total Score:", totalScore);

    return NextResponse.json(
      {
        user,
        scores,
        totalScore,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
