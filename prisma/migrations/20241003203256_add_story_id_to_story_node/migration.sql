-- CreateTable
CREATE TABLE `StoryNode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `storyId` INTEGER NOT NULL,
    `prompt` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Option` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `storyNodeId` INTEGER NOT NULL,
    `nextNodeId` INTEGER NULL,
    `result` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserStoryProgress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `currentNodeId` INTEGER NOT NULL,
    `path` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_storyNodeId_fkey` FOREIGN KEY (`storyNodeId`) REFERENCES `StoryNode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_nextNodeId_fkey` FOREIGN KEY (`nextNodeId`) REFERENCES `StoryNode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserStoryProgress` ADD CONSTRAINT `UserStoryProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserStoryProgress` ADD CONSTRAINT `UserStoryProgress_currentNodeId_fkey` FOREIGN KEY (`currentNodeId`) REFERENCES `StoryNode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
