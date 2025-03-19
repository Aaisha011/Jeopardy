// import prisma from "../lib/prisma.js";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prisma.user.create({
    data: {
      email: "test@example.com",
      password: hashedPassword,
      role: "user",
      name: "Test User", // Optional, since name is nullable
    },
  });
  console.log("User seeded successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Disconnected from database");
  })
  .catch(async (e) => {
    console.error("Error seeding user:", e);
    await prisma.$disconnect();
    process.exit(1);
  });