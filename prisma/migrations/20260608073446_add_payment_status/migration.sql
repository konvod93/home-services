-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'HELD', 'RELEASED', 'REFUNDED', 'DISPUTED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "commissionPct" DOUBLE PRECISION NOT NULL DEFAULT 10,
ADD COLUMN     "heldAt" TIMESTAMP(3),
ADD COLUMN     "liqpayOrderId" TEXT,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
