import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { User, USER_ROLE } from '../models/User.model'
import { AuthService } from '../services/auth.service'
import { asyncHandler, createError, AuthRequest } from '../middleware/errorHandler'

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.nativeEnum(USER_ROLE).optional(),
})

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const validated = loginSchema.parse(req.body)

  // Find user by email
  const user = await User.findOne({ email: validated.email.toLowerCase() })
  if (!user) {
    throw createError('Invalid email or password', 401)
  }

  // Verify password
  const isPasswordValid = await AuthService.comparePassword(validated.password, user.passwordHash)
  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401)
  }

  // Generate token
  const token = AuthService.generateToken(user)

  // Return user data (without password)
  res.json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      team: user.team,
      location: user.location,
    },
  })
})

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const validated = registerSchema.parse(req.body)

  // Check if user already exists
  const existingUser = await User.findOne({ email: validated.email.toLowerCase() })
  if (existingUser) {
    throw createError('User with this email already exists', 409)
  }

  // Hash password
  const passwordHash = await AuthService.hashPassword(validated.password)

  // Determine role
  const emailLower = validated.email.toLowerCase()
  let role = validated.role || USER_ROLE.ORGANIZER

  if (emailLower.includes('admin@') || emailLower.startsWith('admin')) {
    role = USER_ROLE.ADMIN
  } else if (emailLower.includes('organizer@') || emailLower.startsWith('organizer')) {
    role = USER_ROLE.ORGANIZER
  } else if (emailLower.includes('participant@') || emailLower.startsWith('participant')) {
    role = USER_ROLE.PARTICIPANT
  } else if (emailLower.includes('viewer@') || emailLower.startsWith('viewer')) {
    role = USER_ROLE.VIEWER
  }

  // Create user
  const user = new User({
    email: validated.email.toLowerCase(),
    name: validated.name,
    passwordHash,
    role,
  })

  await user.save()

  // Generate token
  const token = AuthService.generateToken(user)

  // Return user data
  res.status(201).json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      team: user.team,
      location: user.location,
    },
  })
})

/**
 * Get current user
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const user = await User.findById(req.user.userId)
  if (!user) {
    throw createError('User not found', 404)
  }

  res.json({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    department: user.department,
    team: user.team,
    location: user.location,
  })
})

