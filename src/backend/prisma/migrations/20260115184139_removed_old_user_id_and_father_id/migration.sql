/*
  Warnings:

  - You are about to drop the column `father_id` on the `habits_table` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `habits_table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "habits_table" DROP COLUMN "father_id",
DROP COLUMN "user_id";
