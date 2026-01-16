-- CreateIndex
CREATE INDEX "Product_outOfStock_idx" ON "Product"("outOfStock");

-- CreateIndex
CREATE INDEX "Product_categoryId_outOfStock_idx" ON "Product"("categoryId", "outOfStock");
