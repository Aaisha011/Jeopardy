import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const categories = [
        { name: "Science" },
        { name: "History" },
        { name: "Literature" },
    ];

    // Step 1: Insert or update categories and get their IDs
    const categoryMap = {};
    for (const category of categories) {
        const createdOrUpdatedCategory = await prisma.questionCategory.upsert({
            where: { name: category.name }, // Check by unique name
            update: {}, // No updates needed if it exists
            create: { name: category.name }, // Create if it doesn’t exist
        });
        categoryMap[category.name] = createdOrUpdatedCategory.id;
    }

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

    // Step 2: Insert questions with the correct categoryId
    for (const categoryData of questions) {
        for (const questionData of categoryData.questions) {
            await prisma.question.create({
                data: {
                    categoryId: categoryMap[categoryData.category],
                    question: questionData.question,
                    options: questionData.options,
                    correctAns: questionData.answer,
                    points: questionData.value,
                },
            });
        }
    }

    // Step 3: Insert SubscriptionPricing data
    await prisma.subscriptionPricing.createMany({
        data: [
            { subscriptionType: "1month", monthlyCost: 10 },
            { subscriptionType: "6months", monthlyCost: 50 },
            { subscriptionType: "lifetime", monthlyCost: 200 },
        ],
        skipDuplicates: true,
    });

    console.log("Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });