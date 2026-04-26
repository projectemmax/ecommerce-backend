-- DropIndex
DROP INDEX "Order_userId_status_key";

-- CreateIndex
CREATE INDEX "Order_userId_status_idx" ON "Order"("userId", "status");
