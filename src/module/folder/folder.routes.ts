import { Router } from "express";
import { folderController } from "./folder.controller";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { createFolderSchema, updateFolderSchema } from "./folder.validation";

const folderRouter = Router();

// 🛡️ All folder endpoints require authentication
folderRouter.use(authenticate);

// 1. Create Folder
folderRouter.post("/", validate(createFolderSchema), (req, res) =>
  folderController.create(req, res)
);

// 2. Get All Folders for logged-in user
folderRouter.get("/", (req, res) => folderController.getAll(req, res));

// 3. Get Single Folder by ID
folderRouter.get("/:id", (req, res) => folderController.getById(req, res));

// 4. Rename Folder
folderRouter.patch("/:id", validate(updateFolderSchema), (req, res) =>
  folderController.update(req, res)
);

// 5. Delete Folder
folderRouter.delete("/:id", (req, res) => folderController.delete(req, res));

export default folderRouter;
