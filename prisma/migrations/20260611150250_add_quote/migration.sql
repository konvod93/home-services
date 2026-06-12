-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_orderId_key" ON "Quote"("orderId");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
