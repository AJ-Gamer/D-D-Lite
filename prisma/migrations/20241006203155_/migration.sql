/*
  Warnings:

  - Added the required column `storyId` to the `StoryNode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `StoryNode` ADD COLUMN `storyId` INTEGER NOT NULL;
