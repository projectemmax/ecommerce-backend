import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const payments = await prisma.paymentTransaction.findMany({
    orderBy: { createdAt: 'asc' }
  });

  const grouped: Record<string, any[]> = {};

  for (const p of payments) {
    if (!grouped[p.orderId]) {
      grouped[p.orderId] = [];
    }
    grouped[p.orderId].push(p);
  }

  for (const orderId in grouped) {
    const attempts = grouped[orderId];

    for (let i = 0; i < attempts.length; i++) {
      await prisma.paymentTransaction.update({
        where: { id: attempts[i].id },
        data: { attemptNo: i + 1 }
      });
    }
  }

  console.log('✅ Backfill completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());