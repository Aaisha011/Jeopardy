import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ✅ GET: Fetch all questions with categories
export async function GET() {
    try {
        const questions = await prisma.question.findMany({
            include: {
                category: true, // Include category details
            },
        });

        return NextResponse.json({ success: true, data: questions }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// ✅ PUT: Update a question
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, question, options, correctAns, points, categoryId } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "Question ID is required" }, { status: 400 });
        }

        const updatedQuestion = await prisma.question.update({
            where: { id },
            data: { 
                question, 
                options: { set: options }, // 👈 Ensure array update works
                correctAns, 
                points, 
                categoryId 
            },
        });

        return NextResponse.json({ success: true, data: updatedQuestion }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
