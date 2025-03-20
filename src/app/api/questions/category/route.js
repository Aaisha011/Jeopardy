import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// create category
export async function POST(req) {
    try {
      const { name } = await req.json();
  
      if (!name) {
        return NextResponse.json({ error: "Category name is required" }, { status: 400 });
      }
  
      const category = await prisma.category.create({
        data: { name },
      });
  
      return NextResponse.json(category, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

//   get all category
  export async function GET() {
    try {
      const categories = await prisma.category.findMany({
        select: { id: true, name: true },
      });
  
      return NextResponse.json(categories, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
  