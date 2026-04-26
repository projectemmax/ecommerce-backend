/*
  Warnings:

  - You are about to drop the column `isVerified` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,productId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Review_productId_idx";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "isVerified",
ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_productId_key" ON "Review"("userId", "productId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
