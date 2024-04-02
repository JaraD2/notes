/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Notes` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Notes` DROP COLUMN `updatedAt`,
    ADD COLUMN `ViewedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `updatedAt`;
