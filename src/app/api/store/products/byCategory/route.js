import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Retrieve products filtered by categoryId (required)
export async function GET(req) {
  try {
    // Extract categoryId from query parameters
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    // Require categoryId to be present
    if (!categoryId) {
      return NextResponse.json(
        { error: 'categoryId query parameter is required' },
        { status: 400 }
      );
    }

    // Fetch products from Prisma filtered by categoryId
    const products = await prisma.product.findMany({
      where: { categoryId },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        basicPrice: true,
        oneMonth: true,
        sixMonth: true,
        lifeTime: true,
        imageUrl: true,
        categoryId: true,
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}