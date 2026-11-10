import { Router } from "express";
import { tagController } from "./tag.controller";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { createTagSchema, updateTagSchema } from "./tag.validation";

const tagRouter = Router();

// 🛡️ All tag endpoints require authentication
tagRouter.use(authenticate);

// 1. Create Tag
tagRouter.post("/", validate(createTagSchema), (req, res) =>
  tagController.create(req, res)
);

// 2. Get All Tags for logged-in user
tagRouter.get("/", (req, res) => tagController.getAll(req, res));

// 3. Get Single Tag by ID
tagRouter.get("/:id", (req, res) => tagController.getById(req, res));

// 4. Rename Tag
tagRouter.patch("/:id", validate(updateTagSchema), (req, res) =>
  tagController.update(req, res)
);

// 5. Delete Tag
tagRouter.delete("/:id", (req, res) => tagController.delete(req, res));

export default tagRouter;
