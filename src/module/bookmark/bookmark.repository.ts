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

        // 🏷️ Connect multiple existing tags by ID
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

  // 2. FETCH ALL (Supports filtering by folderId, tagId, isFavorite)
  async fetchBookmarks(userId: string, filter?: BookmarkFilterDto) {
    return prisma.bookmark.findMany({
      where: {
        userId,
        deletedAt: null,

        // 📂 Filter by folder if requested
        ...(filter?.folderId && { folderId: filter.folderId }),

        // 🏷️ Filter by tag if requested (checks if at least one tag matches)
        ...(filter?.tagId && {
          tags: {
            some: { id: filter.tagId },
          },
        }),

        // ⭐ Filter by favorite status if requested
        ...(filter?.isFavorite !== undefined && { isFavorite: filter.isFavorite }),
      },
      include: {
        folder: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // 3. FETCH SINGLE BY ID (includes its folder and tags)
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
      },
    });
  }

  // 4. UPDATE BOOKMARK (Move folder, re-assign tags, edit details)
  async updateBookmark(id: string, userId: string, data: UpdateBookmarkDto) {
    const { tagIds, ...fields } = data;

    return prisma.bookmark.update({
      where: { id },
      data: {
        ...fields,

        // 🏷️ "set" replaces existing tags with the new tag list
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

  // 5. SOFT DELETE (Instant & safe - moves to trash)
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

  // 6. RESTORE (Moves back from trash)
  async restoreBookmark(id: string, userId: string) {
    return prisma.bookmark.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        deletedAt: null,
      },
    });
  }

  // 7. PERMANENT DELETE (Hard delete from database)
  async permanentDelete(id: string, userId: string) {
    return prisma.bookmark.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }

  // 8. AUTO-CLEANUP: Permanently remove items in trash older than X days
  async purgeOldTrash(days: number = 30) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    return prisma.bookmark.deleteMany({
      where: {
        deletedAt: {
          not: null,
          lt: cutoffDate,
        },
      },
    });
  }
}

export const bookmarkRepo = new BookmarkRepository();
