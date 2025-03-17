import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET Blog API

export async function GET(req, { params }) {
    const { id } = params; 
  
    try {
      const blog = await prisma.blog.findUnique({
        where: { id },
        include: { category: true },
      });
  
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
  
      return NextResponse.json(blog, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
    }
  }  


  // Update Blog API
export async function PUT(req, { params }) {
    const { id } = params;
    const { title, content, imageUrl, categoryId } = await req.json();
  
    try {
      const updatedBlog = await prisma.blog.update({
        where: { id },
        data: { title, content, imageUrl, categoryId },
      });
  
      return NextResponse.json(updatedBlog, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
    }
  }