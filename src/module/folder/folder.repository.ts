import { prisma } from "../../config/db";
import type { CreateFolderDto, UpdateFolderDto } from "./folder.dto";

class FolderRepository {
  async createFolder(userId: string, data: CreateFolderDto) {
    return prisma.folder.create({
      data: {
        name: data.name,
        userId,
      },
      include: {
        _count: {
          select: { bookmarks: true },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.folder.findMany({
      where: { userId },
      include: {
        _count: {
          select: { bookmarks: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string, userId: string) {
    return prisma.folder.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { bookmarks: true },
        },
      },
    });
  }

  async findByName(userId: string, name: string) {
    return prisma.folder.findUnique({
      where: {
        userId_name: { userId, name },
      },
    });
  }

  async updateFolder(id: string, userId: string, data: UpdateFolderDto) {
    return prisma.folder.updateMany({
      where: { id, userId },
      data: { name: data.name },
    });
  }

  async deleteFolder(id: string, userId: string) {
    return prisma.folder.deleteMany({
      where: { id, userId },
    });
  }
}

export const folderRepo = new FolderRepository();
