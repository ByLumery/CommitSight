import { Request } from "express";

export type AuthRequest = Request & {
  user?: { id: string; [k: string]: any };
};
