import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prismaClient";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a blog (POST)
export async function POST(req) {
  try {
    const { title, content, imageUrl, categoryId } = await req.json();
    const newBlog = await prisma.blog.create({
      data: { title, content, imageUrl, categoryId },
    });
    return NextResponse.json(newBlog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

// Fetch blogs or a single blog by ID (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const blog = await prisma.blog.findUnique({
        where: { id },
        include: { category: true },
      });
      if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      return NextResponse.json(blog, { status: 200 });
    } else {
      const blogs = await prisma.blog.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(blogs, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// Update a blog (PUT)
export async function PUT(req) {
  try {
    const { id, title, content, imageUrl, categoryId } = await req.json();
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: { title, content, imageUrl, categoryId },
    });
    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

// Delete a blog (DELETE)
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await prisma.blog.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
