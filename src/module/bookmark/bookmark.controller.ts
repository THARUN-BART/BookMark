import type { Request, Response } from "express";
import { bookmarkService } from "./bookmark.service";

class BookmarkController {
  // 1. POST /api/bookmarks
  async create(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const bookmark = await bookmarkService.create(userId, req.body);
      return res.status(201).json({ success: true, data: bookmark });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 2. GET /api/bookmarks (Search, Filter, Sort)
  async getAll(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const filter = {
        search: req.query.search ? String(req.query.search) : undefined,
        folderId: req.query.folderId ? String(req.query.folderId) : undefined,
        tagId: req.query.tagId ? String(req.query.tagId) : undefined,
        isFavorite:
          req.query.isFavorite !== undefined
            ? req.query.isFavorite === "true"
            : undefined,
        sortBy: req.query.sortBy as "createdAt" | "title" | undefined,
        order: req.query.order as "asc" | "desc" | undefined,
      };

      const bookmarks = await bookmarkService.getAll(userId, filter);
      return res.status(200).json({ success: true, count: bookmarks.length, data: bookmarks });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 3. GET /api/bookmarks/:id
  async getById(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const bookmark = await bookmarkService.getById(id, userId);
      return res.status(200).json({ success: true, data: bookmark });
    } catch (error: any) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  // 4. PATCH /api/bookmarks/:id
  async update(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const updated = await bookmarkService.update(id, userId, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 5. DELETE /api/bookmarks/:id (Soft Delete)
  async softDelete(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const result = await bookmarkService.softDelete(id, userId);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 6. POST /api/bookmarks/:id/restore
  async restore(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const result = await bookmarkService.restore(id, userId);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 7. DELETE /api/bookmarks/:id/permanent
  async permanentDelete(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const result = await bookmarkService.permanentDelete(id, userId);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 🌐 8. POST /api/bookmarks/:id/share-link (Public link toggle)
  async shareLink(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const result = await bookmarkService.shareLink(id, userId);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 🌐 9. POST /api/bookmarks/:id/unshare-link
  async unshareLink(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const result = await bookmarkService.unshareLink(id, userId);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 🌐 10. GET /api/bookmarks/share/:shareCode (PUBLIC - Anyone can view)
  async getPublic(req: Request, res: Response) {
    try {
      const shareCode = req.params.shareCode as string;
      const bookmark = await bookmarkService.getPublicBookmark(shareCode);
      return res.status(200).json({ success: true, data: bookmark });
    } catch (error: any) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  // 🤝 11. POST /api/bookmarks/:id/share-user (Share privately with email)
  async shareWithUser(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const result = await bookmarkService.shareWithUser(id, userId, req.body);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 🤝 12. DELETE /api/bookmarks/:id/share-user/:targetUserId (Revoke private share)
  async unshareWithUser(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const targetUserId = req.params.targetUserId as string;
      const result = await bookmarkService.unshareWithUser(id, userId, targetUserId);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 🤝 13. GET /api/bookmarks/shared-with-me
  async getSharedWithMe(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const bookmarks = await bookmarkService.getSharedWithMe(userId);
      return res.status(200).json({ success: true, count: bookmarks.length, data: bookmarks });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

export const bookmarkController = new BookmarkController();
