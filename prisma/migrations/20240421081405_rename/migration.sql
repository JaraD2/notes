/*
  Warnings:

  - You are about to drop the column `ViewedAt` on the `Notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Notes` DROP COLUMN `ViewedAt`,
    ADD COLUMN `viewedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
