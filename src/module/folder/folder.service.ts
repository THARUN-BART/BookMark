import type { CreateFolderDto, UpdateFolderDto } from "./folder.dto";
import { folderRepo } from "./folder.repository";

class FolderService {
  async create(userId: string, dto: CreateFolderDto) {
    const trimmedName = dto.name.trim();

    // Check if user already has a folder with this name
    const existing = await folderRepo.findByName(userId, trimmedName);
    if (existing) {
      throw new Error("A folder with this name already exists");
    }

    return folderRepo.createFolder(userId, { name: trimmedName });
  }

  async getAll(userId: string) {
    return folderRepo.findByUserId(userId);
  }

  async getById(id: string, userId: string) {
    const folder = await folderRepo.findById(id, userId);
    if (!folder) {
      throw new Error("Folder not found");
    }
    return folder;
  }

  async update(id: string, userId: string, dto: UpdateFolderDto) {
    await this.getById(id, userId);

    const trimmedName = dto.name.trim();
    const existing = await folderRepo.findByName(userId, trimmedName);
    if (existing && existing.id !== id) {
      throw new Error("A folder with this name already exists");
    }

    await folderRepo.updateFolder(id, userId, { name: trimmedName });
    return folderRepo.findById(id, userId);
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);
    await folderRepo.deleteFolder(id, userId);
    return { message: "Folder deleted successfully. Bookmarks inside were moved to root." };
  }
}

export const folderService = new FolderService();
