const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // On crée un client fictif
  const user = await prisma.user.upsert({
    where: { email: 'client@test.com' },
    update: {},
    create: {
      email: 'client@test.com',
      full_name: 'Jean Dupont',
      role: 'CLIENT',
    },
  });

  console.log('Utilisateur de test créé :', user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());