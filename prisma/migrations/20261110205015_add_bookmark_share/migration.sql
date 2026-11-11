-- CreateTable
CREATE TABLE "BookmarkShare" (
    "id" TEXT NOT NULL,
    "bookmarkId" TEXT NOT NULL,
    "sharedWithId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookmarkShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookmarkShare_sharedWithId_idx" ON "BookmarkShare"("sharedWithId");

-- CreateIndex
CREATE INDEX "BookmarkShare_bookmarkId_idx" ON "BookmarkShare"("bookmarkId");

-- CreateIndex
CREATE UNIQUE INDEX "BookmarkShare_bookmarkId_sharedWithId_key" ON "BookmarkShare"("bookmarkId", "sharedWithId");

-- AddForeignKey
ALTER TABLE "BookmarkShare" ADD CONSTRAINT "BookmarkShare_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "Bookmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkShare" ADD CONSTRAINT "BookmarkShare_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
