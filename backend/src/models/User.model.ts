import mongoose, { Schema, Document } from 'mongoose'

export enum USER_ROLE {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  PARTICIPANT = 'participant',
  VIEWER = 'viewer',
}

export interface IUser extends Document {
  email: string
  name: string
  passwordHash: string
  role: USER_ROLE
  department?: string
  team?: string
  location?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.ORGANIZER,
      required: true,
    },
    department: {
      type: String,
      trim: true,
    },
    team: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })

export const User = mongoose.model<IUser>('User', UserSchema)

