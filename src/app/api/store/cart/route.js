const { prisma } = require('@/lib/supabase');
const { NextResponse } = require('next/server');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  return NextResponse.json(cartItems);
}

export async function POST(request) {
  const { userId, productId, quantity } = await request.json();
  const cartItem = await prisma.cartItem.create({
    data: { userId, productId, quantity },
  });
  return NextResponse.json(cartItem);
}