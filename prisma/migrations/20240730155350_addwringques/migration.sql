/*
  Warnings:

  - Added the required column `questionsWrong` to the `Stats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stats" ADD COLUMN     "questionsWrong" INTEGER NOT NULL;
