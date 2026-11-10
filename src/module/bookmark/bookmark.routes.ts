import { Router } from "express";
import { bookmarkController } from "./bookmark.controller";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { createBookmarkSchema, updateBookmarkSchema } from "./bookmark.validation";

const bookmarkRouter = Router();

// 🛡️ All bookmark endpoints require authentication
bookmarkRouter.use(authenticate);

// 1. Create Bookmark
bookmarkRouter.post("/", validate(createBookmarkSchema), (req, res) =>
  bookmarkController.create(req, res)
);

// 2. Get All User Bookmarks
bookmarkRouter.get("/", (req, res) => bookmarkController.getAll(req, res));

// 3. Get Single Bookmark by ID
bookmarkRouter.get("/:id", (req, res) => bookmarkController.getById(req, res));

// 4. Update Bookmark
bookmarkRouter.patch("/:id", validate(updateBookmarkSchema), (req, res) =>
  bookmarkController.update(req, res)
);

// 5. Soft Delete Bookmark (Move to trash)
bookmarkRouter.delete("/:id", (req, res) =>
  bookmarkController.softDelete(req, res)
);

// 6. Restore Bookmark from trash
bookmarkRouter.post("/:id/restore", (req, res) =>
  bookmarkController.restore(req, res)
);

// 7. Permanent Delete (Hard delete)
bookmarkRouter.delete("/:id/permanent", (req, res) =>
  bookmarkController.permanentDelete(req, res)
);

export default bookmarkRouter;
