/*
  Warnings:

  - You are about to drop the column `path` on the `UserStoryProgress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storyId]` on the table `StoryNode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,characterId]` on the table `UserStoryProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `characterId` to the `UserStoryProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `StoryNode` ADD COLUMN `endingType` VARCHAR(191) NULL,
    ADD COLUMN `goldReward` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `gold` INTEGER NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE `UserStoryProgress` DROP COLUMN `path`,
    ADD COLUMN `characterId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Completion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `endingType` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `StoryNode_storyId_key` ON `StoryNode`(`storyId`);

-- CreateIndex
CREATE UNIQUE INDEX `UserStoryProgress_userId_characterId_key` ON `UserStoryProgress`(`userId`, `characterId`);

-- AddForeignKey
ALTER TABLE `Completion` ADD CONSTRAINT `Completion_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
