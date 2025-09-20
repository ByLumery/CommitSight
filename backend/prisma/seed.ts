import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "procontactmitsuki@gmail.com";
  const password = "Charllote2811";
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: hash },
    create: { email, password: hash, name: "Mitsuki" },
  });

  console.log("Seeded:", email);
}

main().finally(() => prisma.$disconnect());
