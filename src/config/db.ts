import { PrismaClient } from "@prisma/client";

// Prevent multiple PrismaClient instances in development due to hot reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Function to test and verify the database connection
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected successfully via Prisma!");
  } catch (error) {
    console.error("❌ Failed to connect to PostgreSQL:", error);
    process.exit(1);
  }
}
