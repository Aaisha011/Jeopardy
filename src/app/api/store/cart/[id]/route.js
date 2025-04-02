// app/api/store/cart/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path to your NextAuth config

const prisma = new PrismaClient();

// PUT: Update quantity and price of a cart item
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    // Get authenticated user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id; // Assumes user ID is in session

    // Parse request body
    const { quantity, price } = await req.json();

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }
    if (!price || price < 0) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      );
    }

    // Update the cart item
    const updatedItem = await prisma.cartItem.update({
      where: { id, userId }, // Ensure the item belongs to the user
      data: { quantity, price },
      include: { product: true },
    });

    // Fetch the updated cart for the user
    const updatedCart = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove a cart item
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Get authenticated user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id, userId }, // Ensure the item belongs to the user
    });

    // Fetch the updated cart for the user
    const updatedCart = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { error: 'Failed to delete cart item', details: error.message },
      { status: 500 }
    );
  }
}