import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true, versionKey: false },
})
export class Deal extends Document {
  // ─── Core Relations ───────────────────────────────────────────────
  @Prop({ type: Types.ObjectId, ref: 'Lead', required: true, unique: true, index: true })
  lead: Types.ObjectId; // 1:1 → one deal per lead (unique index prevents duplicates)

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  broker: Types.ObjectId; // Who registered the deal (must match lead.purchasedBy)

  // ─── Deal Status & Lifecycle ──────────────────────────────────────
  @Prop({
    type: String,
    enum: ['registered', 'documents_uploaded', 'closed', 'cancelled'],
    default: 'registered',
    index: true,
  })
  status: string;

  // ─── Timeline & Details ───────────────────────────────────────────
  @Prop({ type: Date, default: Date.now })
  registeredAt: Date;

  @Prop({ type: Date })
  documentsUploadedAt?: Date;

  @Prop({ type: Date })
  closedAt?: Date;
 
  @Prop({ type: String, trim: true })
  notes?: string; // Broker/admin internal notes

  @Prop({ type: String })
  rejectionReason?: string; // If admin cancels/rejects

  @Prop({ type: Boolean, default: false })
  isHot: boolean; // For priority follow-up

  // ─── Admin & Audit ────────────────────────────────────────────────
  @Prop({ type: Types.ObjectId, ref: 'User' })
  lastUpdatedBy?: Types.ObjectId; // Who last changed status (mostly admin)
}

export const DealSchema = SchemaFactory.createForClass(Deal);

// Compound indexes
DealSchema.index({ broker: 1, status: 1 });
DealSchema.index({ lead: 1, status: 1 });