-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CharacterItems` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CharacterItems_AB_unique`(`A`, `B`),
    INDEX `_CharacterItems_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CharacterItems` ADD CONSTRAINT `_CharacterItems_A_fkey` FOREIGN KEY (`A`) REFERENCES `Character`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CharacterItems` ADD CONSTRAINT `_CharacterItems_B_fkey` FOREIGN KEY (`B`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
