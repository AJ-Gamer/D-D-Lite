/*
  Warnings:

  - A unique constraint covering the columns `[storyId]` on the table `StoryNode` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `storynode` ADD COLUMN `endingType` VARCHAR(191) NULL,
    ADD COLUMN `goldReward` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `StoryNode_storyId_key` ON `StoryNode`(`storyId`);
