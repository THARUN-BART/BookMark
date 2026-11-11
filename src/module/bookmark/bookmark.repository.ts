import { prisma } from "../../config/db";
import type { CreateBookmarkDto, UpdateBookmarkDto, BookmarkFilterDto } from "./bookmark.dto";

class BookmarkRepository {
  // 1. CREATE BOOKMARK (Connects folder and multiple tags)
  async createBookmark(userId: string, data: CreateBookmarkDto) {
    return prisma.bookmark.create({
      data: {
        url: data.url,
        title: data.title,
        description: data.description,
        favicon: data.favicon,
        previewImage: data.previewImage,
        isFavorite: data.isFavorite ?? false,
        userId,
        folderId: data.folderId,
        tags:
          data.tagIds && data.tagIds.length > 0
            ? {
                connect: data.tagIds.map((id) => ({ id })),
              }
            : undefined,
      },
      include: {
        folder: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } },
      },
    });
  }

  // 2. FETCH ALL (Search title/URL + Filter folder/tag/favorite + Sort)
  async fetchBookmarks(userId: string, filter?: BookmarkFilterDto) {
    return prisma.bookmark.findMany({
      where: {
        userId,
        deletedAt: null,

        // 🔍 Search title OR URL (Case-insensitive)
        ...(filter?.search && {
          OR: [
            { title: { contains: filter.search, mode: "insensitive" } },
            { url: { contains: filter.search, mode: "insensitive" } },
          ],
        }),

        // 📂 Filter by folder
        ...(filter?.folderId && { folderId: filter.folderId }),

        // 🏷️ Filter by tag
        ...(filter?.tagId && {
          tags: {
            some: { id: filter.tagId },
          },
        }),

        // ⭐ Filter by favorite
        ...(filter?.isFavorite !== undefined && { isFavorite: filter.isFavorite }),
      },
      include: {
        folder: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } },
        shares: {
          include: {
            sharedWith: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: {
        [filter?.sortBy || "createdAt"]: filter?.order || "desc",
      },
    });
  }

  // 3. FETCH SINGLE BY ID
  async findById(id: string, userId: string) {
    return prisma.bookmark.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        folder: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } },
        shares: {
          include: {
            sharedWith: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  // 4. UPDATE BOOKMARK
  async updateBookmark(id: string, userId: string, data: UpdateBookmarkDto) {
    const { tagIds, ...fields } = data;

    return prisma.bookmark.update({
      where: { id },
      data: {
        ...fields,
        ...(tagIds && {
          tags: {
            set: tagIds.map((tagId) => ({ id: tagId })),
          },
        }),
      },
      include: {
        folder: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } },
      },
    });
  }

  // 5. SOFT DELETE
  async deleteBookmark(id: string, userId: string) {
    return prisma.bookmark.updateMany({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // 6. RESTORE
  async restoreBookmark(id: string, userId: string) {
    return prisma.bookmark.updateMany({
      where: { id, userId },
      data: { deletedAt: null },
    });
  }

  // 7. PERMANENT DELETE
  async permanentDelete(id: string, userId: string) {
    return prisma.bookmark.deleteMany({
      where: { id, userId },
    });
  }

  // 8. AUTO-CLEANUP
  async purgeOldTrash(days: number = 30) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return prisma.bookmark.deleteMany({
      where: {
        deletedAt: { not: null, lt: cutoffDate },
      },
    });
  }

  // 🌐 9. PUBLIC LINK: SHARE
  async shareLink(id: string, userId: string, shareCode: string) {
    return prisma.bookmark.updateMany({
      where: { id, userId, deletedAt: null },
      data: { isPublic: true, shareCode },
    });
  }

  // 🌐 10. PUBLIC LINK: UNSHARE
  async unshareLink(id: string, userId: string) {
    return prisma.bookmark.updateMany({
      where: { id, userId, deletedAt: null },
      data: { isPublic: false, shareCode: null },
    });
  }

  // 🌐 11. PUBLIC LINK: GET BY SHARE CODE
  async findPublicByShareCode(shareCode: string) {
    return prisma.bookmark.findFirst({
      where: {
        shareCode,
        isPublic: true,
        deletedAt: null,
      },
      include: {
        user: { select: { name: true } },
        tags: { select: { id: true, name: true } },
      },
    });
  }

  // 🤝 12. PRIVATE USER SHARING: SHARE WITH SPECIFIC USER
  async shareWithUser(bookmarkId: string, sharedWithId: string) {
    return prisma.bookmarkShare.create({
      data: {
        bookmarkId,
        sharedWithId,
      },
      include: {
        sharedWith: { select: { id: true, name: true, email: true } },
      },
    });
  }

  // 🤝 13. PRIVATE USER SHARING: REVOKE USER SHARE
  async unshareWithUser(bookmarkId: string, sharedWithId: string) {
    return prisma.bookmarkShare.deleteMany({
      where: {
        bookmarkId,
        sharedWithId,
      },
    });
  }

  // 🤝 14. PRIVATE USER SHARING: GET BOOKMARKS SHARED WITH ME
  async fetchSharedWithMe(userId: string) {
    const shares = await prisma.bookmarkShare.findMany({
      where: {
        sharedWithId: userId,
        bookmark: {
          deletedAt: null,
        },
      },
      include: {
        bookmark: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            tags: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return shares.map((s) => s.bookmark);
  }

  // Helper: Find user by email
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
}

export const bookmarkRepo = new BookmarkRepository();
