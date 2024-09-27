-- CreateTable
CREATE TABLE `Character` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `class` VARCHAR(191) NOT NULL,
    `race` VARCHAR(191) NOT NULL,
    `constitution` INTEGER NOT NULL,
    `strength` INTEGER NOT NULL,
    `dexterity` INTEGER NOT NULL,
    `charisma` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Weapon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `damage` INTEGER NOT NULL,
    `rarity` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Armor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `defense` INTEGER NOT NULL,
    `rarity` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CharacterWeapons` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CharacterWeapons_AB_unique`(`A`, `B`),
    INDEX `_CharacterWeapons_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CharacterArmor` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CharacterArmor_AB_unique`(`A`, `B`),
    INDEX `_CharacterArmor_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CharacterWeapons` ADD CONSTRAINT `_CharacterWeapons_A_fkey` FOREIGN KEY (`A`) REFERENCES `Character`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CharacterWeapons` ADD CONSTRAINT `_CharacterWeapons_B_fkey` FOREIGN KEY (`B`) REFERENCES `Weapon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CharacterArmor` ADD CONSTRAINT `_CharacterArmor_A_fkey` FOREIGN KEY (`A`) REFERENCES `Armor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CharacterArmor` ADD CONSTRAINT `_CharacterArmor_B_fkey` FOREIGN KEY (`B`) REFERENCES `Character`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
