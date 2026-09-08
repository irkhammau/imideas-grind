-- DropTable
DROP TABLE `Staff`;

-- AlterTable
ALTER TABLE `Event`
    MODIFY `logo` VARCHAR(2048) NOT NULL;

-- AlterTable
ALTER TABLE `EventGallery`
    MODIFY `imageUrl` VARCHAR(2048) NOT NULL;

-- AlterTable
ALTER TABLE `GlobalGallery`
    MODIFY `imageUrl` VARCHAR(2048) NOT NULL;

-- AlterTable
ALTER TABLE `Partner`
    MODIFY `logo` VARCHAR(2048) NOT NULL;
