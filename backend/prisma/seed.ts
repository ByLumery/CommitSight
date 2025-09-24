import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário de teste
  const hashedPassword = await bcrypt.hash('Charllote2811', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'procontactmitsuki@gmail.com' },
    update: {},
    create: {
      email: 'procontactmitsuki@gmail.com',
      name: 'Usuário Teste',
      password: hashedPassword,
    },
  });

  console.log('✅ Usuário criado:', { id: user.id, email: user.email });
  console.log('🌱 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
