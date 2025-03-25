import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Create a new category
export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const category = await prisma.productCategory.create({
      data: {
        name,
      },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/store/categories:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Get all categories
export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/store/categories:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Delete a category
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const category = await prisma.productCategory.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with associated products" },
        { status: 400 }
      );
    }

    await prisma.productCategory.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/store/categories:", error);
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete category due to foreign key constraint" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}