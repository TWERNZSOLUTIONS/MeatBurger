/*
  Warnings:

  - You are about to drop the column `customerId` on the `LoyaltyCard` table. All the data in the column will be lost.
  - You are about to drop the column `purchases` on the `LoyaltyCard` table. All the data in the column will be lost.
  - You are about to drop the column `rewardGiven` on the `LoyaltyCard` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `LoyaltyCard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `LoyaltyCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `LoyaltyCard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LoyaltyCard" DROP CONSTRAINT "LoyaltyCard_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropIndex
DROP INDEX "LoyaltyCard_customerId_key";

-- AlterTable
ALTER TABLE "LoyaltyCard" DROP COLUMN "customerId",
DROP COLUMN "purchases",
DROP COLUMN "rewardGiven",
ADD COLUMN     "lembrete" TEXT,
ADD COLUMN     "meta" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "pedidos" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Não premiado';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerId";

-- DropTable
DROP TABLE "Customer";

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyCard_phone_key" ON "LoyaltyCard"("phone");
