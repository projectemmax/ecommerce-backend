-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('COD', 'PAYMONGO', 'XENDIT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'GCASH', 'MAYA', 'CARD');

-- CreateEnum
CREATE TYPE "CheckoutPaymentMethod" AS ENUM ('COD', 'GCASH', 'MAYA', 'CARD');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';
ALTER TYPE "PaymentStatus" ADD VALUE 'EXPIRED';

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "method" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "checkoutSessionId" TEXT,
    "paymentIntentId" TEXT,
    "paymentMethodId" TEXT,
    "sourceId" TEXT,
    "gatewayReference" TEXT,
    "redirectUrl" TEXT,
    "rawRequest" JSONB,
    "rawResponse" JSONB,
    "webhookPayload" JSONB,
    "paidAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransactionLog" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentTransactionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentTransaction_orderId_idx" ON "PaymentTransaction"("orderId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_status_idx" ON "PaymentTransaction"("status");

-- CreateIndex
CREATE INDEX "PaymentTransaction_checkoutSessionId_idx" ON "PaymentTransaction"("checkoutSessionId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_paymentIntentId_idx" ON "PaymentTransaction"("paymentIntentId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_gatewayReference_idx" ON "PaymentTransaction"("gatewayReference");

-- CreateIndex
CREATE INDEX "PaymentTransactionLog_paymentId_idx" ON "PaymentTransactionLog"("paymentId");

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransactionLog" ADD CONSTRAINT "PaymentTransactionLog_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "PaymentTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
