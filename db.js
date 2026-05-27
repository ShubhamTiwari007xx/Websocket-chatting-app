import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

prisma.$connect()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));