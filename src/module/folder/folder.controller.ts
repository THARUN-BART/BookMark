import type { Request, Response } from "express";
import { folderService } from "./folder.service";

class FolderController {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const folder = await folderService.create(userId, req.body);
      return res.status(201).json({ success: true, data: folder });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const folders = await folderService.getAll(userId);
      return res.status(200).json({ success: true, data: folders });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const folder = await folderService.getById(id, userId);
      return res.status(200).json({ success: true, data: folder });
    } catch (error: any) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const updated = await folderService.update(id, userId, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const result = await folderService.delete(id, userId);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

export const folderController = new FolderController();
