// /api/subscription/route.js
const { prisma } = require('@/lib/supabase');
const { NextResponse } = require('next/server');
const { getServerSession } = require('next-auth/next');
const { authOptions } = require('../auth/[...nextauth]/route');

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, subscriptionType } = await request.json();
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Validate subscription type
    const pricing = await prisma.subscriptionPricing.findUnique({
      where: { subscriptionType },
    });
    if (!pricing) {
      return NextResponse.json({ error: 'Invalid subscription type' }, { status: 400 });
    }

    // Get user's current score
    const userScore = await prisma.score.findFirst({
      where: { userId },
    });
    const currentPoints = userScore ? userScore.score : 0;

    if (currentPoints < pricing.monthlyCost) {
      return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
    }

    // Calculate subscription end date
    let subscriptionEnd = new Date();
    if (subscriptionType === '1month') {
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
    } else if (subscriptionType === '6month') { // Use "6month" for consistency
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 6);
    } else if (subscriptionType === 'lifetime') {
      subscriptionEnd = null;
    } else {
      return NextResponse.json({ error: 'Unsupported subscription type' }, { status: 400 });
    }

    // Deduct points and update subscription in a transaction
    const [updatedScore, updatedUser] = await prisma.$transaction([
      prisma.score.update({
        where: { id: userScore.id },
        data: { score: currentPoints - pricing.monthlyCost },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionType,
          subscriptionEnd,
        },
      }),
    ]);

    return NextResponse.json({
      message: 'Subscription updated',
      user: updatedUser,
      points: updatedScore.score,
    }, { status: 200 });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to update subscription', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}