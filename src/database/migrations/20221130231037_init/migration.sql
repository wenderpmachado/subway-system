-- CreateTable
CREATE TABLE "TrainLine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stations" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainLine_name_key" ON "TrainLine"("name");
