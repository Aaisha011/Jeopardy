import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST API - Process a purchase and deduct points
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { productId, price } = await req.json();

    // Fetch user's current score
    const userScore = await prisma.score.findFirst({
      where: { userId },
    });

    if (!userScore) {
      return NextResponse.json(
        { error: "User score not found" },
        { status: 404 }
      );
    }

    if (userScore.score < price) {
      return NextResponse.json(
        { error: "Insufficient points" },
        { status: 400 }
      );
    }

    // Transaction: Deduct points and record purchase
    const [updatedScore, purchase] = await prisma.$transaction([
      prisma.score.update({
        where: { id: userScore.id },
        data: { score: userScore.score - price },
      }),
      prisma.purchase.create({
        data: {
          userId,
          productId,
          price,
          purchasedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json(
      {
        message: "Purchase successful",
        points: updatedScore.score, // Return updated score
        purchaseId: purchase.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing purchase:", error);
    return NextResponse.json(
      { error: "Failed to process purchase", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET API - Fetch user's purchase history
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        purchasedAt: "desc",
      },
    });

    const purchaseHistory = purchases.map((purchase) => ({
      id: purchase.id,
      productId: purchase.productId,
      productName: purchase.product.name,
      price: purchase.price,
      purchaseDate: purchase.purchasedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        purchases: purchaseHistory,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchase history", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}