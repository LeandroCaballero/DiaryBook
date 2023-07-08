// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

interface CustomNodeJsGlobal {
  prisma: PrismaClient
}

declare const global: CustomNodeJsGlobal

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === "development") global.prisma = prisma

export default prisma

// import { PrismaClient } from '@prisma/client';

// // Instancia singleton de PrismaClient
// let prisma: PrismaClient;

// // Función para obtener la instancia de PrismaClient
// export const getPrisma = (): PrismaClient => {
//   if (!prisma) {
//     prisma = new PrismaClient();
//   }
//   return prisma;
// };
