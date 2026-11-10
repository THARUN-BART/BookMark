import type { CreateTagDto, UpdateTagDto } from "./tag.dto";
import { tagRepo } from "./tag.repository";

class TagService {
  async create(userId: string, dto: CreateTagDto) {
    const normalizedName = dto.name.trim().toLowerCase();

    // Check if tag already exists for this user
    const existing = await tagRepo.findByName(userId, normalizedName);
    if (existing) {
      throw new Error(`Tag '#${normalizedName}' already exists`);
    }

    return tagRepo.createTag(userId, { name: normalizedName });
  }

  async getAll(userId: string) {
    return tagRepo.findByUserId(userId);
  }

  async getById(id: string, userId: string) {
    const tag = await tagRepo.findById(id, userId);
    if (!tag) {
      throw new Error("Tag not found");
    }
    return tag;
  }

  async update(id: string, userId: string, dto: UpdateTagDto) {
    await this.getById(id, userId);

    const normalizedName = dto.name.trim().toLowerCase();
    const existing = await tagRepo.findByName(userId, normalizedName);
    if (existing && existing.id !== id) {
      throw new Error(`Tag '#${normalizedName}' already exists`);
    }

    await tagRepo.updateTag(id, userId, { name: normalizedName });
    return tagRepo.findById(id, userId);
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);
    await tagRepo.deleteTag(id, userId);
    return { message: "Tag deleted successfully" };
  }
}

export const tagService = new TagService();
