import { PrismaClient } from "@prisma/client";

console.log("=== DEBUGGING PRISMA ===");

try {
  console.log("✅ PrismaClient imported");
  console.log("PrismaClient type:", typeof PrismaClient);

  console.log("\n--- Attempting to create instance ---");
  // Pass 'log' to satisfy the non-empty config requirement
  const prisma = new PrismaClient({ log: ["info"] });
  console.log("✅ Instance created successfully!");

  await prisma.$connect();
  console.log("✅ Connected to database!");

  await prisma.$disconnect();
  console.log("✅ All good!");
} catch (error) {
  console.error("❌ Error:", error);
}
