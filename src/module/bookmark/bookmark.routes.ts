import { Router } from "express";
import { bookmarkController } from "./bookmark.controller";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import {
  createBookmarkSchema,
  updateBookmarkSchema,
  shareWithUserSchema,
} from "./bookmark.validation";

const bookmarkRouter = Router();

// =========================================================================
// 🌐 1. PUBLIC ROUTES (No authentication required!)
// Anyone with the share code can view this public bookmark
// =========================================================================
bookmarkRouter.get("/share/:shareCode", (req, res) =>
  bookmarkController.getPublic(req, res)
);

// =========================================================================
// 🛡️ 2. PROTECTED ROUTES (Requires valid JWT token or cookie)
// =========================================================================
bookmarkRouter.use(authenticate);

// 🔍 Fetch user's bookmarks (Supports ?search=...&folderId=...&tagId=...&sortBy=...&order=...)
bookmarkRouter.get("/", (req, res) => bookmarkController.getAll(req, res));

// 🤝 Fetch bookmarks that other users shared with the logged-in user
bookmarkRouter.get("/shared-with-me", (req, res) =>
  bookmarkController.getSharedWithMe(req, res)
);

// 📄 Fetch single bookmark by ID
bookmarkRouter.get("/:id", (req, res) => bookmarkController.getById(req, res));

// ➕ Create bookmark
bookmarkRouter.post("/", validate(createBookmarkSchema), (req, res) =>
  bookmarkController.create(req, res)
);

// ✏️ Update bookmark (partial update)
bookmarkRouter.patch("/:id", validate(updateBookmarkSchema), (req, res) =>
  bookmarkController.update(req, res)
);

// 🗑️ Soft delete bookmark (move to trash)
bookmarkRouter.delete("/:id", (req, res) =>
  bookmarkController.softDelete(req, res)
);

// ♻️ Restore bookmark from trash
bookmarkRouter.post("/:id/restore", (req, res) =>
  bookmarkController.restore(req, res)
);

// ❌ Permanent hard delete
bookmarkRouter.delete("/:id/permanent", (req, res) =>
  bookmarkController.permanentDelete(req, res)
);

// 🌐 Public Link Sharing: Enable public link
bookmarkRouter.post("/:id/share-link", (req, res) =>
  bookmarkController.shareLink(req, res)
);

// 🌐 Public Link Sharing: Disable public link
bookmarkRouter.post("/:id/unshare-link", (req, res) =>
  bookmarkController.unshareLink(req, res)
);

// 🤝 User-to-User Private Sharing: Share with email
bookmarkRouter.post(
  "/:id/share-user",
  validate(shareWithUserSchema),
  (req, res) => bookmarkController.shareWithUser(req, res)
);

// 🤝 User-to-User Private Sharing: Revoke user access
bookmarkRouter.delete("/:id/share-user/:targetUserId", (req, res) =>
  bookmarkController.unshareWithUser(req, res)
);

export default bookmarkRouter;
