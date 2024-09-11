/*
  Warnings:

  - You are about to drop the column `reportCount` on the `spam` table. All the data in the column will be lost.
  - Added the required column `markedByUserId` to the `spam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spam" DROP COLUMN "reportCount",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "markedByUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "spam" ADD CONSTRAINT "spam_markedByUserId_fkey" FOREIGN KEY ("markedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
