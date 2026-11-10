import express, { type Request, type Response } from "express";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "UP",
    service: "bookmark-api",
    date:new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});