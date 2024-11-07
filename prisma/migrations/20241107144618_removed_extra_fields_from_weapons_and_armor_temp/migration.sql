/*
  Warnings:

  - You are about to drop the column `defense` on the `armor` table. All the data in the column will be lost.
  - You are about to drop the column `rarity` on the `armor` table. All the data in the column will be lost.
  - You are about to drop the column `damage` on the `weapon` table. All the data in the column will be lost.
  - You are about to drop the column `rarity` on the `weapon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `armor` DROP COLUMN `defense`,
    DROP COLUMN `rarity`;

-- AlterTable
ALTER TABLE `weapon` DROP COLUMN `damage`,
    DROP COLUMN `rarity`;
