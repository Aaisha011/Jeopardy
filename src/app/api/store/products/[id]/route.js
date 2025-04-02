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
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET: Retrieve a single product by ID
export async function GET(req, { params }) {
  try {
    const { id } = params; // Destructure params safely

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
  }
}

// PUT: Update a product by ID
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const formData = await req.formData();
    const productDataString = formData.get("product");

    if (!productDataString) {
      return NextResponse.json(
        { error: "Product data is required" },
        { status: 400 }
      );
    }

    let productData;
    try {
      productData = JSON.parse(productDataString);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid product data format", details: "JSON parsing failed" },
        { status: 400 }
      );
    }

    // Convert numeric fields to integers
    const updateData = {
      name: productData.name,
      description: productData.description,
      type: productData.type,
      basicPrice: parseInt(productData.basicPrice, 10),
      oneMonth: parseInt(productData.oneMonth, 10),
      sixMonth: parseInt(productData.sixMonth, 10),
      lifeTime: parseInt(productData.lifeTime, 10),
      categoryId: productData.categoryId,
      imageUrl: productData.imageUrl, // Preserve existing URL if no new image
    };

    // Validate numeric fields
    for (const field of ['basicPrice', 'oneMonth', 'sixMonth', 'lifeTime']) {
      if (isNaN(updateData[field])) {
        return NextResponse.json(
          { error: `${field} must be a valid number` },
          { status: 400 }
        );
      }
    }

    // Handle image upload to Supabase if provided
    if (formData.has("image")) {
      const image = formData.get("image");
      const fileName = `${id}-${Date.now()}-${image.name}`; // Unique filename

      // Upload to Supabase bucket
      const { data, error } = await supabase.storage
        .from('product-images') // Your bucket name
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: true, // Overwrite if exists
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload image", details: error.message },
          { status: 500 }
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      updateData.imageUrl = urlData.publicUrl;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params; // Destructure params safely

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists before deletion
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete image from Supabase if it exists
    if (product.imageUrl) {
      const fileName = product.imageUrl.split('/').pop();
      const { error } = await supabase.storage
        .from('product-images')
        .remove([fileName]);
      if (error) {
        console.error("Supabase delete error:", error);
        // Log error but don't fail the request
      }
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product', details: error.message },
      { status: 500 }
    );
  }
}