import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";

/**
 * AuthRequest — used by every protected controller.
 * Attaches `req.user.id` after token verification.
 */
export interface AuthRequest extends Request {
  user?: { id: string };
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
    req.user = { id: payload.userId };
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized: invalid or expired token." });
  }
}