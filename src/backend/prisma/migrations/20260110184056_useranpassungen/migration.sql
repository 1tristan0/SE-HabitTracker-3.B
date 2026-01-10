/*
  Warnings:

  - The primary key for the `habits_table` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `food_points` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `recovery_on` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `streak_duration` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `streak_freezes` on the `users` table. All the data in the column will be lost.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "animal_type" AS ENUM ('hund', 'katze', 'hamster', 'wurm');

-- CreateEnum
CREATE TYPE "animal_mood" AS ENUM ('gluecklich', 'traurig');

-- AlterTable
ALTER TABLE "habits_table" DROP CONSTRAINT "habits_table_pkey",
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "habits_table_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "habits_table_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "created_at",
DROP COLUMN "food_points",
DROP COLUMN "name",
DROP COLUMN "recovery_on",
DROP COLUMN "streak_duration",
DROP COLUMN "streak_freezes",
ADD COLUMN     "animal_mood" "animal_mood" NOT NULL DEFAULT 'gluecklich',
ADD COLUMN     "animal_type" "animal_type" NOT NULL DEFAULT 'hund',
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "habits_table" ADD CONSTRAINT "habits_table_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
