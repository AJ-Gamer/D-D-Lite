/*
  Warnings:

  - You are about to drop the column `path` on the `userstoryprogress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,characterId]` on the table `UserStoryProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `characterId` to the `UserStoryProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userstoryprogress` DROP COLUMN `path`,
    ADD COLUMN `characterId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserStoryProgress_userId_characterId_key` ON `UserStoryProgress`(`userId`, `characterId`);
