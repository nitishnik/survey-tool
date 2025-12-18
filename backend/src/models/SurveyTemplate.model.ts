import mongoose, { Schema, Document, Types } from 'mongoose'
import { IQuestion, ITargetAudience, TargetAudienceSchema } from './Survey.model'

export enum TEMPLATE_CATEGORY {
  TRAINING_FEEDBACK = 'training_feedback',
  SKILL_ASSESSMENT = 'skill_assessment',
  PROCESS_MATURITY = 'process_maturity',
  WORKSHOP_READINESS = 'workshop_readiness',
}

const QuestionSchema = new Schema<IQuestion>(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      default: undefined,
    },
    required: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

export interface ISurveyTemplate extends Document {
  name: string
  description: string
  category: TEMPLATE_CATEGORY
  questions: IQuestion[]
  targetAudience: ITargetAudience
  createdBy: Types.ObjectId
  createdAt: Date
  usageCount: number
}

const SurveyTemplateSchema = new Schema<ISurveyTemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(TEMPLATE_CATEGORY),
      required: true,
    },
    questions: {
      type: [QuestionSchema],
      default: [],
    },
    targetAudience: {
      type: TargetAudienceSchema,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
SurveyTemplateSchema.index({ createdBy: 1 })
SurveyTemplateSchema.index({ category: 1 })

export const SurveyTemplate = mongoose.model<ISurveyTemplate>('SurveyTemplate', SurveyTemplateSchema)

