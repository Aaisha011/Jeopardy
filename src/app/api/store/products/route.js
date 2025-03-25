import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// POST: Create a new product
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');
    const productData = JSON.parse(formData.get('product') || '{}');

    // Validate required fields
    if (!productData.name || !productData.type || !productData.categoryId) {
      return NextResponse.json(
        { error: 'Missing name, type, or categoryId' },
        { status: 400 }
      );
    }

    // Upload image to Supabase Storage if provided
    let imageUrl = '';
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage
        .from('store-product-images')
        .upload(fileName, file);

      if (error) {
        return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
      }

      const { data } = supabase.storage.from('store-product-images').getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    // Create product in Prisma
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description || '',
        type: productData.type,
        basicPrice: parseInt(productData.basicPrice) || 0,
        oneMonth: parseInt(productData.oneMonth) || 0,
        sixMonth: parseInt(productData.sixMonth) || 0,
        lifeTime: parseInt(productData.lifeTime) || 0,
        imageUrl: imageUrl || '',
        categoryId: productData.categoryId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET: Retrieve all products
export async function GET() {
  try {
    // Fetch all products from Prisma
    const products = await prisma.product.findMany({
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
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}