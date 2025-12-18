import mongoose, { Schema, Document, Types } from 'mongoose'

export enum SURVEY_STATUS {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
}

export enum QUESTION_TYPE {
  MULTIPLE_CHOICE = 'multiple_choice',
  RATING_SCALE = 'rating_scale',
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
}

export interface ITargetAudience {
  teams?: string[]
  departments?: string[]
  roles?: string[]
  locations?: string[]
}

export interface IQuestion {
  id: string
  type: QUESTION_TYPE
  text: string
  options?: string[]
  required: boolean
  order: number
}

const QuestionSchema = new Schema<IQuestion>(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(QUESTION_TYPE),
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

const TargetAudienceSchema = new Schema<ITargetAudience>(
  {
    teams: [String],
    departments: [String],
    roles: [String],
    locations: [String],
  },
  { _id: false }
)

export interface ISurvey extends Document {
  title: string
  purpose: string
  targetAudience: ITargetAudience
  openDate: Date
  closeDate: Date
  questions: IQuestion[]
  status: SURVEY_STATUS
  createdBy: Types.ObjectId
  createdAt: Date
  templateId?: Types.ObjectId
  version: number
}

const SurveySchema = new Schema<ISurvey>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    targetAudience: {
      type: TargetAudienceSchema,
      required: true,
    },
    openDate: {
      type: Date,
      required: true,
    },
    closeDate: {
      type: Date,
      required: true,
    },
    questions: {
      type: [QuestionSchema],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(SURVEY_STATUS),
      default: SURVEY_STATUS.DRAFT,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'SurveyTemplate',
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
SurveySchema.index({ createdBy: 1 })
SurveySchema.index({ status: 1 })
SurveySchema.index({ openDate: 1 })
SurveySchema.index({ closeDate: 1 })

export const Survey = mongoose.model<ISurvey>('Survey', SurveySchema)

