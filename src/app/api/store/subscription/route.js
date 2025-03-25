const { prisma } = require('@/lib/supabase');
const { NextResponse } = require('next/server');

export async function POST(request) {
  const { userId, subscriptionType } = await request.json();

  const pricing = await prisma.subscriptionPricing.findUnique({
    where: { subscriptionType },
  });
  if (!pricing) {
    return NextResponse.json({ error: 'Invalid subscription type' }, { status: 400 });
  }

  const userScores = await prisma.score.aggregate({
    where: { userId },
    _sum: { score: true },
  });
  const totalPoints = userScores._sum.score || 0;

  if (totalPoints < pricing.monthlyCost) {
    return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
  }

  let subscriptionEnd = new Date();
  if (subscriptionType === '1month') {
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
  } else if (subscriptionType === '6months') {
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 6);
  } else if (subscriptionType === 'lifetime') {
    subscriptionEnd = null;
  } else {
    subscriptionEnd = null;
  }

  await prisma.score.create({
    data: {
      userId,
      score: -pricing.monthlyCost,
    },
  });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionType,
      subscriptionEnd,
    },
  });

  return NextResponse.json({ message: 'Subscription updated', user: updatedUser });
}