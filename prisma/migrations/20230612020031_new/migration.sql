-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SUBSCRIBED', 'UNSUBSCRIBED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetPassword" (
    "email" TEXT NOT NULL,
    "pass_reset_token" BIGINT NOT NULL,
    "pass_reset_token_expires" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "RefreshTokenHash" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,

    CONSTRAINT "RefreshTokenHash_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ResetPassword_email_key" ON "ResetPassword"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokenHash_user_id_key" ON "RefreshTokenHash"("user_id");

-- AddForeignKey
ALTER TABLE "RefreshTokenHash" ADD CONSTRAINT "RefreshTokenHash_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
