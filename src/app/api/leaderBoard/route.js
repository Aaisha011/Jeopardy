import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all users' scores in descending order
    const scores = await prisma.score.findMany({
      include: {
        user: {
          select: { name: true }, // Fetch only the user's name
        },
      },
      orderBy: { score: "desc" }, // Sort scores in descending order
    });

    // Assign ranks based on sorted order
    const leaderboard = scores.map((entry, index) => ({
      rank: index + 1, // Rank starts from 1
      name: entry.user.name,
      score: entry.score,
    }));

    return NextResponse.json({ success: true, leaderboard }, { status: 200 });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
