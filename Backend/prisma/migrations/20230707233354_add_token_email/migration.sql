/*
  Warnings:

  - You are about to drop the column `productId` on the `PurchaseItem` table. All the data in the column will be lost.
  - You are about to drop the column `shared` on the `PurchaseItem` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productName` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenEmail` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PurchaseItem" DROP CONSTRAINT "PurchaseItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_B_fkey";

-- AlterTable
ALTER TABLE "PurchaseItem" DROP COLUMN "productId",
DROP COLUMN "shared",
ADD COLUMN     "productName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "purchaseItemId" INTEGER,
ADD COLUMN     "tokenEmail" TEXT NOT NULL;

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "_GroupToUser";

-- CreateTable
CREATE TABLE "_Admins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Users" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PurchaseItemToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Admins_AB_unique" ON "_Admins"("A", "B");

-- CreateIndex
CREATE INDEX "_Admins_B_index" ON "_Admins"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Users_AB_unique" ON "_Users"("A", "B");

-- CreateIndex
CREATE INDEX "_Users_B_index" ON "_Users"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PurchaseItemToUser_AB_unique" ON "_PurchaseItemToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PurchaseItemToUser_B_index" ON "_PurchaseItemToUser"("B");

-- AddForeignKey
ALTER TABLE "_Admins" ADD CONSTRAINT "_Admins_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Admins" ADD CONSTRAINT "_Admins_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Users" ADD CONSTRAINT "_Users_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Users" ADD CONSTRAINT "_Users_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PurchaseItemToUser" ADD CONSTRAINT "_PurchaseItemToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "PurchaseItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PurchaseItemToUser" ADD CONSTRAINT "_PurchaseItemToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
