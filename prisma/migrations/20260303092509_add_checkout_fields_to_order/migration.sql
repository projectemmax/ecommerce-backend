-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "placedAt" TIMESTAMP(3),
ADD COLUMN     "shippingAddress" TEXT,
ADD COLUMN     "shippingFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "shippingName" TEXT,
ADD COLUMN     "shippingPhone" TEXT;
