import type { CreateBookmarkDto, UpdateBookmarkDto } from "./bookmark.dto";
import { bookmarkRepo } from "./bookmark.repository";

class BookmarkService {
    // 1. CREATE BOOKMARK
    async create(userId: string, dto: CreateBookmarkDto) {
    return bookmarkRepo.createBookmark(userId, dto);
    }

    // 2. GET ALL BOOKMARKS
    async getAll(userId: string) {
    return bookmarkRepo.fetchBookmarks(userId);
    }

    // 3. GET SINGLE BOOKMARK BY ID
    async getById(id: string, userId: string) {
    const bookmark = await bookmarkRepo.findById(id, userId);
    if (!bookmark) {
        throw new Error("Bookmark not found");
    } 
    return bookmark;
    } 

    // 4. UPDATE BOOKMARK 
    async update(id: string, userId: string, dto: UpdateBookmarkDto) {
    // Check if it exists and belongs to this user
    await this.getById(id, userId);

    // Perform the update 
    await bookmarkRepo.updateBookmark(id, userId, dto);

    // Return the updated record
    return bookmarkRepo.findById(id, userId);
    }

    // 5. SOFT DELETE (Move to trash)
    async softDelete(id: string, userId: string) {
    await this.getById(id, userId);
    await bookmarkRepo.deleteBookmark(id, userId);
    return { message: "Bookmark moved to trash successfully" }; 
    }

    // 6. RESTORE FROM TRASH 
    async restore(id: string, userId: string) { 
    const result = await bookmarkRepo.restoreBookmark(id, userId);
    if (result.count === 0) { 
        throw new Error("Bookmark not found in trash");
    } 
    return { message: "Bookmark restored successfully" }; 
    }

    // 7. PERMANENT DELETE (Hard delete)
    async permanentDelete(id: string, userId: string) { 
    const result = await bookmarkRepo.permanentDelete(id, userId);
    if (result.count === 0) { 
        throw new Error("Bookmark not found"); 
    }
    return { message: "Bookmark permanently deleted" }; 
    }

    /// 8. CLEAN EXPIRED TRASH
    async cleanExpiredTrash() {                                                                                                                                                                  
        const result = await bookmarkRepo.purgeOldTrash(30);                                                                                                                                       
        console.log(`🧹 Auto-purged ${result.count} expired bookmarks from trash.`);                                                                                                               
        return result;
    }
}

export const bookmarkService = new BookmarkService(); 