import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL, // 2. USE THIS INSTEAD
  } as any); // "as any" bypasses the TS bug

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
