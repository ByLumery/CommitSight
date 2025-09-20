import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Configurações antes de todos os testes
});

beforeEach(async () => {
  // Limpar dados antes de cada teste
  await prisma.user.deleteMany();
  await prisma.repository.deleteMany();
  await prisma.commit.deleteMany();
  await prisma.contributor.deleteMany();
  await prisma.language.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.pullRequest.deleteMany();
  await prisma.favoriteRepository.deleteMany();
  await prisma.analysis.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

