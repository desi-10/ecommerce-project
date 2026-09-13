-- CreateTable
CREATE TABLE "product_view" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_view_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_view_productId_idx" ON "product_view"("productId");

-- CreateIndex
CREATE INDEX "product_view_userId_createdAt_idx" ON "product_view"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "product_view_sessionId_createdAt_idx" ON "product_view"("sessionId", "createdAt");

-- AddForeignKey
ALTER TABLE "product_view" ADD CONSTRAINT "product_view_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_view" ADD CONSTRAINT "product_view_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
