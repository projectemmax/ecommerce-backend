-- Safely convert the existing string column to enum without losing data
ALTER TABLE "Order"
ALTER COLUMN "paymentMethod"
TYPE "PaymentMethod"
USING (
  CASE
    WHEN "paymentMethod" IS NULL THEN NULL
    WHEN "paymentMethod" = 'COD' THEN 'COD'::"PaymentMethod"
    WHEN "paymentMethod" = 'GCASH' THEN 'GCASH'::"PaymentMethod"
    WHEN "paymentMethod" = 'MAYA' THEN 'MAYA'::"PaymentMethod"
    WHEN "paymentMethod" = 'CARD' THEN 'CARD'::"PaymentMethod"
    ELSE NULL
  END
);

-- Remove the old enum if Prisma previously created it
DROP TYPE IF EXISTS "CheckoutPaymentMethod";