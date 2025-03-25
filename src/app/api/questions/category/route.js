import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//  GET: Fetch all categories
export async function GET() {
    try {
        const categories = await prisma.questionCategory.findMany();
        return NextResponse.json({ success: true, data: categories }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

//  PUT: Update a category
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "Category ID is required" }, { status: 400 });
        }

        const updatedCategory = await prisma.questionCategory.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json({ success: true, data: updatedCategory }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
