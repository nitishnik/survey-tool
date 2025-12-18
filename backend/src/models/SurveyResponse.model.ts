import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IAnswer {
  questionId: string
  value: string | number | string[]
}

const AnswerSchema = new Schema<IAnswer>(
  {
    questionId: {
      type: String,
      required: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
)

export interface ISurveyResponse extends Document {
  surveyId: Types.ObjectId
  userId?: Types.ObjectId
  answers: IAnswer[]
  submittedAt: Date
  anonymous: boolean
  respondentName?: string
  respondentEmail?: string
}

const SurveyResponseSchema = new Schema<ISurveyResponse>(
  {
    surveyId: {
      type: Schema.Types.ObjectId,
      ref: 'Survey',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    answers: {
      type: [AnswerSchema],
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
      required: true,
    },
    respondentName: {
      type: String,
      trim: true,
    },
    respondentEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: false,
  }
)

// Indexes
SurveyResponseSchema.index({ surveyId: 1, userId: 1 })
SurveyResponseSchema.index({ surveyId: 1, 'respondentEmail': 1 })
SurveyResponseSchema.index({ submittedAt: -1 })

export const SurveyResponse = mongoose.model<ISurveyResponse>('SurveyResponse', SurveyResponseSchema)

