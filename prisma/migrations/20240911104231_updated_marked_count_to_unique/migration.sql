/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `spam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "spam_phoneNumber_key" ON "spam"("phoneNumber");
