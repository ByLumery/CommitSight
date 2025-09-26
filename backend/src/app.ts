import express, { Request, Response } from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth";

export const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// healthcheck
app.get("/health", (_req: Request, res: Response) => res.status(200).json({ ok: true }));