-- CreateEnum
CREATE TYPE "animal_type" AS ENUM ('hund', 'katze', 'hamster', 'wurm');

-- CreateEnum
CREATE TYPE "animal_mood" AS ENUM ('gluecklich', 'traurig');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "animal_mood" "animal_mood" NOT NULL DEFAULT 'gluecklich',
ADD COLUMN     "animal_type" "animal_type" NOT NULL DEFAULT 'hund';
