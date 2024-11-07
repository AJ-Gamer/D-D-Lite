/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Armor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Weapon` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Armor_name_key` ON `Armor`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Weapon_name_key` ON `Weapon`(`name`);
