
const questions = [
  {
    category: "Science",
    questions: [
      {
        value: 100,
        question: "What is the chemical formula for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        answer: "H2O",
      },
      {
        value: 200,
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Venus", "Mars", "Jupiter"],
        answer: "Mars",
      },
      {
        value: 500,
        question: "What gas do plants absorb for photosynthesis?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        answer: "Carbon Dioxide",
      },
    ],
  },
  {
    category: "History",
    questions: [
      {
        value: 100,
        question: "Who was the first President of the United States?",
        options: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"],
        answer: "George Washington",
      },
      {
        value: 200,
        question: "In which year did World War II end?",
        options: ["1939", "1945", "1918", "1965"],
        answer: "1945",
      },
      {
        value: 500,
        question: "Which ancient civilization built the pyramids?",
        options: ["Greeks", "Romans", "Egyptians", "Mayans"],
        answer: "Egyptians",
      },
    ],
  },
  {
    category: "Literature",
    questions: [
      {
        value: 100,
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["William Shakespeare", "Charles Dickens", "J.K. Rowling", "Mark Twain"],
        answer: "William Shakespeare",
      },
      {
        value: 200,
        question: "Who is the author of '1984'?",
        options: ["George Orwell", "Aldous Huxley", "Isaac Asimov", "Ray Bradbury"],
        answer: "George Orwell",
      },
      {
        value: 500,
        question: "Which novel starts with 'Call me Ishmael'?",
        options: ["Moby-Dick", "The Great Gatsby", "To Kill a Mockingbird", "Pride and Prejudice"],
        answer: "Moby-Dick",
      },
    ],
  },
];

export default questions;


import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { categoryId, question, options, correctAns, points } = body;

    // Validation
    if (!categoryId || !question || !options || !correctAns || points === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return NextResponse.json({ error: "Options must be an array of exactly 4 answers" }, { status: 400 });
    }

    if (!options.includes(correctAns)) {
      return NextResponse.json({ error: "Correct answer must be one of the provided options" }, { status: 400 });
    }

    // Create new question
    const newQuestion = await prisma.question.create({
      data: { categoryId, question, options, correctAns, points },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// get qusetions
export async function GET() {
    try {
      const categories = await prisma.category.findMany({
        include: {
          questions: {
            select: {
              id: true,
              question: true,
              options: true,
              correctAns: true,
              points: true,
            },
          },
        },
      });
  
      return NextResponse.json(categories, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
//   update questions
  export async function PUT(req) {
    try {
      const body = await req.json();
      const { id, question, options, correctAns, points } = body;
  
      if (!id) {
        return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
      }
  
      if (options && (!Array.isArray(options) || options.length !== 4)) {
        return NextResponse.json({ error: "Options must be an array of exactly 4 answers" }, { status: 400 });
      }
  
      if (correctAns && options && !options.includes(correctAns)) {
        return NextResponse.json({ error: "Correct answer must be one of the provided options" }, { status: 400 });
      }
  
      const updatedQuestion = await prisma.question.update({
        where: { id },
        data: { question, options, correctAns, points },
      });
  
      return NextResponse.json(updatedQuestion, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  

//   delete questios
export async function DELETE(req) {
    try {
      const questionId = req.nextUrl.searchParams.get("id");
  
      if (!questionId) {
        return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
      }
  
      await prisma.question.delete({ where: { id: questionId } });
  
      return NextResponse.json({ message: "Question deleted successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  