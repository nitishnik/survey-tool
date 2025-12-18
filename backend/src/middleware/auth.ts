import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { User } from '../models/User.model'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
    role: string
  }
}

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = AuthService.extractTokenFromHeader(authHeader)

    if (!token) {
      res.status(401).json({ error: 'Authentication required' })
      return
    }

    const payload = AuthService.verifyToken(token)

    // Optionally verify user still exists
    const user = await User.findById(payload.userId)
    if (!user) {
      res.status(401).json({ error: 'User not found' })
      return
    }

    req.user = payload
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

/**
 * Middleware to check if user has required role
 */
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' })
      return
    }

    next()
  }
}

