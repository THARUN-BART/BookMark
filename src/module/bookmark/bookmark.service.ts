import crypto from "crypto";
import type {
  CreateBookmarkDto,
  UpdateBookmarkDto,
  BookmarkFilterDto,
  ShareWithUserDto,
} from "./bookmark.dto";
import { bookmarkRepo } from "./bookmark.repository";
import { getOrSetCache, invalidateCache } from "../../utils/cache";

class BookmarkService {
  // 1. CREATE BOOKMARK
  async create(userId: string, dto: CreateBookmarkDto) {
    const bookmark = await bookmarkRepo.createBookmark(userId, dto);
    await invalidateCache(`bookmarks:${userId}`);
    return bookmark;
  }

  // 2. GET ALL BOOKMARKS (Search, Filter, Sort, Redis Caching)
  async getAll(userId: string, filter?: BookmarkFilterDto) {
    // If user is searching or applying filters, bypass cache and query DB directly
    if (
      filter?.search ||
      filter?.folderId ||
      filter?.tagId ||
      filter?.isFavorite !== undefined ||
      filter?.sortBy
    ) {
      return bookmarkRepo.fetchBookmarks(userId, filter);
    }

    // Default bookmark feed: Cached in Redis for 1 hour (3600 seconds)
    return getOrSetCache(`bookmarks:${userId}`, 3600, () => {
      return bookmarkRepo.fetchBookmarks(userId, filter);
    });
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
    await this.getById(id, userId);
    await bookmarkRepo.updateBookmark(id, userId, dto);
    await invalidateCache(`bookmarks:${userId}`);
    return bookmarkRepo.findById(id, userId);
  }

  // 5. SOFT DELETE
  async softDelete(id: string, userId: string) {
    await this.getById(id, userId);
    await bookmarkRepo.deleteBookmark(id, userId);
    await invalidateCache(`bookmarks:${userId}`);
    return { message: "Bookmark moved to trash successfully" };
  }

  // 6. RESTORE FROM TRASH
  async restore(id: string, userId: string) {
    const result = await bookmarkRepo.restoreBookmark(id, userId);
    if (result.count === 0) {
      throw new Error("Bookmark not found in trash");
    }
    await invalidateCache(`bookmarks:${userId}`);
    return { message: "Bookmark restored successfully" };
  }

  // 7. PERMANENT DELETE
  async permanentDelete(id: string, userId: string) {
    const result = await bookmarkRepo.permanentDelete(id, userId);
    if (result.count === 0) {
      throw new Error("Bookmark not found");
    }
    await invalidateCache(`bookmarks:${userId}`);
    return { message: "Bookmark permanently deleted" };
  }

  // 8. CLEAN EXPIRED TRASH
  async cleanExpiredTrash() {
    const result = await bookmarkRepo.purgeOldTrash(30);
    console.log(`🧹 Auto-purged ${result.count} expired bookmarks from trash.`);
    return result;
  }

  // 🌐 9. PUBLIC LINK: ENABLE
  async shareLink(id: string, userId: string) {
    await this.getById(id, userId);

    // Generate random 8-character hex code
    const shareCode = crypto.randomBytes(4).toString("hex");
    await bookmarkRepo.shareLink(id, userId, shareCode);

    return {
      message: "Public share link generated successfully",
      shareCode,
      shareUrl: `/api/bookmarks/share/${shareCode}`,
    };
  }

  // 🌐 10. PUBLIC LINK: DISABLE
  async unshareLink(id: string, userId: string) {
    await this.getById(id, userId);
    await bookmarkRepo.unshareLink(id, userId);
    return { message: "Public link disabled. Bookmark is now private." };
  }

  // 🌐 11. PUBLIC LINK: VIEW (No login required)
  async getPublicBookmark(shareCode: string) {
    const bookmark = await bookmarkRepo.findPublicByShareCode(shareCode);
    if (!bookmark) {
      throw new Error("Shared bookmark not found or is private");
    }
    return bookmark;
  }

  // 🤝 12. PRIVATE SHARE WITH SPECIFIC USER (Google Docs style)
  async shareWithUser(id: string, userId: string, dto: ShareWithUserDto) {
    // 1. Verify owner owns this bookmark
    await this.getById(id, userId);

    // 2. Find recipient user by email
    const recipient = await bookmarkRepo.findUserByEmail(dto.email.trim().toLowerCase());
    if (!recipient) {
      throw new Error("No user registered with this email address");
    }

    if (recipient.id === userId) {
      throw new Error("You cannot share a bookmark with yourself");
    }

    // 3. Share with recipient
    try {
      const share = await bookmarkRepo.shareWithUser(id, recipient.id);
      return {
        message: `Bookmark successfully shared with ${dto.email}`,
        sharedWith: share.sharedWith,
      };
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("This bookmark is already shared with this user");
      }
      throw error;
    }
  }

  // 🤝 13. REVOKE PRIVATE SHARE
  async unshareWithUser(id: string, userId: string, targetUserId: string) {
    await this.getById(id, userId);
    const result = await bookmarkRepo.unshareWithUser(id, targetUserId);
    if (result.count === 0) {
      throw new Error("Bookmark was not shared with this user");
    }
    return { message: "Sharing permission revoked successfully" };
  }

  // 🤝 14. GET BOOKMARKS SHARED WITH ME
  async getSharedWithMe(userId: string) {
    return bookmarkRepo.fetchSharedWithMe(userId);
  }
}

export const bookmarkService = new BookmarkService();
