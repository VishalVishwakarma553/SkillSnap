-- CreateEnum
CREATE TYPE "public"."LevelEnum" AS ENUM ('Begginer', 'Intermediate', 'Advance');

-- CreateEnum
CREATE TYPE "public"."CourseStatus" AS ENUM ('Public', 'Private', 'Draft');

-- CreateTable
CREATE TABLE "public"."Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "level" "public"."LevelEnum" NOT NULL DEFAULT 'Begginer',
    "category" TEXT NOT NULL,
    "smallDescription" TEXT NOT NULL,
    "status" "public"."CourseStatus" NOT NULL DEFAULT 'Draft',
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "public"."Course"("slug");

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
