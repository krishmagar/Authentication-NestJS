-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" DEFAULT 'UNSUBSCRIBED',
    "image" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);
