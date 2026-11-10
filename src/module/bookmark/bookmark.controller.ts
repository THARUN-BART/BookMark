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

  // 2. GET /api/bookmarks
  async getAll(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const bookmarks = await bookmarkService.getAll(userId);
      return res.status(200).json({ success: true, data: bookmarks });
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
}

export const bookmarkController = new BookmarkController();
