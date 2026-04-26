import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$executeRawUnsafe(`
    UPDATE "Order"
    SET
      status = 'CONFIRMED',
      "paymentStatus" = 'PAID',
      "placedAt" = NOW()
    WHERE status = 'PAID'
  `);

  console.log(`Updated ${result} orders`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });