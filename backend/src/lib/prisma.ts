import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.USE_PRISMA_MOCK === "true") {
  // Exporta um mock leve; os testes podem reconfigurar comportamento via jest.mock
  // @ts-ignore
  prisma = {} as PrismaClient;
} else {
  prisma = new PrismaClient();
}

export { prisma };
