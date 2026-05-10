-- Add courier/shipment metadata for manual courier integrations such as J&T.
CREATE TYPE "ShippingStatus" AS ENUM ('PENDING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'RETURNED');

ALTER TABLE "Order"
ADD COLUMN "trackingUrl" TEXT,
ADD COLUMN "courierName" TEXT,
ADD COLUMN "courierCode" TEXT,
ADD COLUMN "shippingMethod" TEXT,
ADD COLUMN "shippingStatus" "ShippingStatus" NOT NULL DEFAULT 'PENDING';
