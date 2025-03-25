// import { createClient } from "@supabase/supabase-js";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// // Get a product by ID
// export async function GET(req, { params }) {
//   const { id } = params;

//   try {
//     const product = await prisma.product.findUnique({
//       where: { id },
//       include: { category: true },
//     });

//     if (!product) {
//       return new Response(JSON.stringify({ error: "Product not found" }), {
//         status: 404,
//       });
//     }

//     return new Response(JSON.stringify({ success: true, product }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error in GET /api/products/[id]:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//     });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// // Delete a product by ID
// export async function DELETE(req, { params }) {
//   const { id } = params;

//   try {
//     const product = await prisma.product.findUnique({
//       where: { id },
//     });

//     if (!product) {
//       return new Response(JSON.stringify({ error: "Product not found" }), {
//         status: 404,
//       });
//     }

//     const fileName = product.imageUrl.split("/").pop();
//     const { error: storageError } = await supabase.storage
//       .from("product-images")
//       .remove([fileName]);

//     if (storageError) {
//       console.error("Supabase Storage Delete Error:", storageError);
//     }

//     await prisma.product.delete({
//       where: { id },
//     });

//     return new Response(
//       JSON.stringify({ success: true, message: "Product deleted" }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error in DELETE /api/products/[id]:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//     });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Retrieve a single product by ID
export async function GET(req, { params }) {
  try {
    const { id } = params; // Extract the product ID from the dynamic route

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
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

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
// Update API
export async function PUT(req, { params }) {
  try {
    const formData = await req.formData();
    const productData = JSON.parse(formData.get('product'));
    
    const product = await prisma.product.update({
      where: { id: params.id },
      data: productData,
    });
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
// Delete API

export async function DELETE(req, { params }) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}