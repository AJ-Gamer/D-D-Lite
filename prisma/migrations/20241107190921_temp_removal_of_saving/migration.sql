/*
  Warnings:

  - You are about to drop the column `statCheckId` on the `option` table. All the data in the column will be lost.
  - You are about to drop the `userstoryprogress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `option` DROP FOREIGN KEY `Option_statCheckId_fkey`;

-- DropForeignKey
ALTER TABLE `userstoryprogress` DROP FOREIGN KEY `UserStoryProgress_currentNodeId_fkey`;

-- DropForeignKey
ALTER TABLE `userstoryprogress` DROP FOREIGN KEY `UserStoryProgress_userId_fkey`;

-- DropIndex
DROP INDEX `StoryNode_storyId_key` ON `storynode`;

-- AlterTable
ALTER TABLE `option` DROP COLUMN `statCheckId`;

-- DropTable
DROP TABLE `userstoryprogress`;
