/*
  Warnings:

  - You are about to drop the `_characterarmor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_characterweapons` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_characterarmor` DROP FOREIGN KEY `_CharacterArmor_A_fkey`;

-- DropForeignKey
ALTER TABLE `_characterarmor` DROP FOREIGN KEY `_CharacterArmor_B_fkey`;

-- DropForeignKey
ALTER TABLE `_characterweapons` DROP FOREIGN KEY `_CharacterWeapons_A_fkey`;

-- DropForeignKey
ALTER TABLE `_characterweapons` DROP FOREIGN KEY `_CharacterWeapons_B_fkey`;

-- AlterTable
ALTER TABLE `character` ADD COLUMN `armorId` INTEGER NULL,
    ADD COLUMN `weaponId` INTEGER NULL;

-- DropTable
DROP TABLE `_characterarmor`;

-- DropTable
DROP TABLE `_characterweapons`;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_armorId_fkey` FOREIGN KEY (`armorId`) REFERENCES `Armor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_weaponId_fkey` FOREIGN KEY (`weaponId`) REFERENCES `Weapon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
