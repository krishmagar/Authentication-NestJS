/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Service_id_key" ON "Service"("id");
