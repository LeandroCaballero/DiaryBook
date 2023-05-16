import { PrismaClient } from "@prisma/client"

export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === "production") {
  global.prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }

  global.prisma = global.prisma
}
