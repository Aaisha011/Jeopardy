import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch total scores for each user, sorted in descending order
    const scores = await prisma.score.groupBy({
      by: ["userId"],
      _sum: { score: true },
      orderBy: { _sum: { score: "desc" } }, // Sort by total score
    });

    // Fetch user names for the leaderboard
    const users = await prisma.user.findMany({
      where: {
        id: { in: scores.map((s) => s.userId) },
      },
      select: { id: true, name: true },
    });

    // Map user names with total scores and assign ranks
    const leaderboard = scores.map((entry, index) => ({
      rank: index + 1, // Assign rank
      name: users.find((user) => user.id === entry.userId)?.name || "Unknown",
      totalScore: entry._sum.score,
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
