import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import authRouter from "./module/auth/auth.routes";
import bookmarkRouter from "./module/bookmark/bookmark.routes";
import folderRouter from "./module/folder/folder.routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "UP",
    service: "bookmark-api",
    date: new Date().toISOString(),
  });
});

// Auth endpoints
app.use("/api/auth", authRouter);

// Bookmark endpoints (Protected by authenticate)
app.use("/api/bookmarks", bookmarkRouter);

// Folder endpoints (Protected by authenticate)
app.use("/api/folders", folderRouter);

async function startServer() {
  // 1. Verify database connection first
  await connectDB();

  // 2. Start the HTTP server
  app.listen(port, () => {
    console.log(`🚀 Server listening on http://localhost:${port}`);
  });
}

startServer();
