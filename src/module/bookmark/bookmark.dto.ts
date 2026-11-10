export interface CreateBookmarkDto {
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  previewImage?: string;
  isFavorite?: boolean;
  folderId?: string;
  tagIds?: string[];
}

export interface UpdateBookmarkDto {
  title?: string;
  description?: string;
  url?: string;
  favicon?: string;
  previewImage?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  folderId?: string | null;
  tagIds?: string[];
}

export interface BookmarkFilterDto {
  search?: string;
  folderId?: string;
  tagId?: string;
  isFavorite?: boolean;
  sortBy?: "createdAt" | "title";
  order?: "asc" | "desc";
}

export interface ShareWithUserDto {
  email: string;
}
