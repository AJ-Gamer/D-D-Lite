-- AlterTable
ALTER TABLE `option` ADD COLUMN `statCheckId` INTEGER NULL;

-- CreateTable
CREATE TABLE `StatCheck` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stat` VARCHAR(191) NOT NULL,
    `difficulty` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_statCheckId_fkey` FOREIGN KEY (`statCheckId`) REFERENCES `StatCheck`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
