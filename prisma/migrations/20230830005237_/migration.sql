/*
  Warnings:

  - You are about to drop the column `short_url` on the `Url` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hash]` on the table `Url` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hash` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Url_short_url_key";

-- AlterTable
ALTER TABLE "Url" DROP COLUMN "short_url",
ADD COLUMN     "hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Url_hash_key" ON "Url"("hash");
