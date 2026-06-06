-- CreateTable
CREATE TABLE "UnblockRequest" (
    "id" TEXT NOT NULL,
    "masterId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "documents" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnblockRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnblockRequest_masterId_key" ON "UnblockRequest"("masterId");

-- AddForeignKey
ALTER TABLE "UnblockRequest" ADD CONSTRAINT "UnblockRequest_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "Master"("id") ON DELETE CASCADE ON UPDATE CASCADE;
