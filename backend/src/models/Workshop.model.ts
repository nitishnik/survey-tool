import mongoose, { Schema, Document, Types } from 'mongoose'
import { ITargetAudience } from './Survey.model'

export enum WORKSHOP_STATUS {
  DRAFT = 'draft',
  PLANNED = 'planned',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface IWorkshopObjective {
  id: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

const WorkshopObjectiveSchema = new Schema<IWorkshopObjective>(
  {
    id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
  },
  { _id: false }
)

const TargetAudienceSchema = new Schema<ITargetAudience>(
  {
    teams: [String],
    departments: [String],
    roles: [String],
    locations: [String],
  },
  { _id: false }
)

export interface IWorkshop extends Document {
  title: string
  description: string
  topic: string
  objectives: IWorkshopObjective[]
  linkedSurveyIds: Types.ObjectId[]
  targetAudience: ITargetAudience
  expectedSize: number
  scheduledDate: Date
  duration: number
  location?: string
  status: WORKSHOP_STATUS
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  version: number
}

const WorkshopSchema = new Schema<IWorkshop>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    objectives: {
      type: [WorkshopObjectiveSchema],
      default: [],
    },
    linkedSurveyIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Survey',
      default: [],
    },
    targetAudience: {
      type: TargetAudienceSchema,
      required: true,
    },
    expectedSize: {
      type: Number,
      required: true,
      min: 1,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(WORKSHOP_STATUS),
      default: WORKSHOP_STATUS.DRAFT,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
WorkshopSchema.index({ createdBy: 1 })
WorkshopSchema.index({ status: 1 })
WorkshopSchema.index({ scheduledDate: 1 })

export const Workshop = mongoose.model<IWorkshop>('Workshop', WorkshopSchema)

