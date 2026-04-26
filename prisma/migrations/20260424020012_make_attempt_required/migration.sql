/*
  Warnings:

  - Made the column `attemptNo` on table `PaymentTransaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PaymentTransaction" ALTER COLUMN "attemptNo" SET NOT NULL;
