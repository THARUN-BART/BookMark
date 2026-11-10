import { prisma } from "../../config/db";
import type { CreateBookmarkDto, UpdateBookmarkDto } from "./bookmark.dto";

class BookmarkRepository {
    // 1. CREATE
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
        },
    });
    }

    // 2. FETCH ALL (Active bookmarks for logged-in user)
    async fetchBookmarks(userId: string) {
    return prisma.bookmark.findMany({
        where: {
        userId,
        deletedAt: null, // Exclude soft-deleted items (trash)
        },
        orderBy: {
        createdAt: "desc", // Newest bookmarks first 
        },
    });
    } 

    // 3. FETCH SINGLE BY ID (Must belong to user and not deleted)
    async findById(id: string, userId: string) {
    return prisma.bookmark.findFirst({
        where: {
        id, 
        userId,
        deletedAt: null,
        }, 
    });
    }

    // 4. UPDATE (Partial update: title, notes, isFavorite, etc.)
    async updateBookmark(id: string, userId: string, data: UpdateBookmarkDto) {
    return prisma.bookmark.updateMany({
        where: { 
        id, 
        userId,
        deletedAt: null,
        },
        data,
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
    async purgeOldTrash(days:number=30) {
         // Calculate date: exactly 30 days ago
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
        return prisma.bookmark.deleteMany({
          where: {
            deletedAt: {
              not: null,
              lt: cutoffDate, // "lt" = Less Than (older than 30 days ago)
            },
          },
        });

    }
}

export const bookmarkRepo = new BookmarkRepository(); 