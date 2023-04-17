import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const main = async () => {
  for (let i = 0; i < 50; i++) {
    await prisma.user.create({
      data: {
        username: faker.name.firstName(),
        password: faker.name.firstName(),
      },
    });
  }
};

main()
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
