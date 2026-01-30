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
  - Added the required column `userId` to the `habits_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "habits_table" DROP CONSTRAINT "habits_table_pkey",
ADD COLUMN     "userId" TEXT NOT NULL,
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
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "habits_table" ADD CONSTRAINT "habits_table_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
