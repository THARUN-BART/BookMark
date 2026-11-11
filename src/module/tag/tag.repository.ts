import { prisma } from "../../config/db";
import type { CreateTagDto, UpdateTagDto } from "./tag.dto";

class TagRepository {
  async createTag(userId: string, data: CreateTagDto) {
    return prisma.tag.create({
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
    return prisma.tag.findMany({
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
    return prisma.tag.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { bookmarks: true },
        },
      },
    });
  }

  async findByName(userId: string, name: string) {
    return prisma.tag.findUnique({
      where: {
        userId_name: { userId, name },
      },
    });
  }

  async updateTag(id: string, userId: string, data: UpdateTagDto) {
    return prisma.tag.updateMany({
      where: { id, userId },
      data: { name: data.name },
    });
  }

  async deleteTag(id: string, userId: string) {
    return prisma.tag.deleteMany({
      where: { id, userId },
    });
  }
}

export const tagRepo = new TagRepository();
