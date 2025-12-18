import mongoose, { Schema, Document, Types } from 'mongoose'

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  PUBLISH = 'publish',
  CLOSE = 'close',
  SCHEDULE = 'schedule',
  COMPLETE = 'complete',
  EXPORT = 'export',
}

export enum AuditEntity {
  SURVEY = 'survey',
  RESPONSE = 'response',
  WORKSHOP = 'workshop',
  TEMPLATE = 'template',
  USER = 'user',
}

export interface IAuditLog extends Document {
  userId: Types.ObjectId | string
  userEmail?: string
  action: AuditAction
  entity: AuditEntity
  entityId: string
  entityName?: string
  changes?: Record<string, { old: any; new: any }>
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.Mixed,
      required: true,
    },
    userEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: true,
    },
    entity: {
      type: String,
      enum: Object.values(AuditEntity),
      required: true,
    },
    entityId: {
      type: String,
      required: true,
      index: true,
    },
    entityName: {
      type: String,
      trim: true,
    },
    changes: {
      type: Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: false,
  }
)

// Indexes
AuditLogSchema.index({ entityId: 1, entity: 1 })
AuditLogSchema.index({ userId: 1 })
AuditLogSchema.index({ timestamp: -1 })
AuditLogSchema.index({ entity: 1, timestamp: -1 })

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema)

