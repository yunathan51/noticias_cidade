import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ log: ["query"] })
  }
  prisma = global.prisma
} else {
  prisma = new PrismaClient({ log: ["query"] })
}

export { prisma }
