/*
  Warnings:

  - A unique constraint covering the columns `[characterId,equipmentId]` on the table `EquippedItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `EquippedItem_characterId_equipmentId_key` ON `EquippedItem`(`characterId`, `equipmentId`);
