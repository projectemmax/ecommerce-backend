/*
  Warnings:

  - A unique constraint covering the columns `[userId,status]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Order_userId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Order_userId_status_key" ON "Order"("userId", "status");
