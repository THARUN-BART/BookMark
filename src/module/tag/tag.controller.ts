import type { Request, Response } from "express";
import { tagService } from "./tag.service";

class TagController {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const tag = await tagService.create(userId, req.body);
      return res.status(201).json({ success: true, data: tag });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const tags = await tagService.getAll(userId);
      return res.status(200).json({ success: true, data: tags });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const tag = await tagService.getById(id, userId);
      return res.status(200).json({ success: true, data: tag });
    } catch (error: any) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const updated = await tagService.update(id, userId, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const result = await tagService.delete(id, userId);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

export const tagController = new TagController();
