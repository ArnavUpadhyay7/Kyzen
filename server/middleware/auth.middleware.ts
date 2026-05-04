import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: no token provided." });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized: invalid or expired token." });
  }
}