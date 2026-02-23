import { PrismaClient } from "@prisma/client";

const DATABASE_URL =
  "postgresql://postgres.bvdxjpemzbhmfxjxdqqj:4f7Vh6O3iWiMdOt9@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";

const prisma = new PrismaClient({
  datasources: {
    db: { url: DATABASE_URL },
  },
});

async function test() {
  console.log("🔍 Testing connection...");
  console.log("📍 URL:", DATABASE_URL.replace(/:[^:@]+@/, ":***@")); // Hide password

  try {
    await prisma.$connect();
    console.log("✅ Connection successful!");

    const users = await prisma.user.findMany({ take: 1 });
    console.log(`✅ Found ${users.length} users`);
  } catch (error: any) {
    console.error("❌ Connection failed!");
    console.error("Error:", error.message);
    console.error("Code:", error.code);
  } finally {
    await prisma.$disconnect();
  }
}

test();
