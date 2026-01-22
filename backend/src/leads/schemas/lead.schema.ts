 import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true, versionKey: false },
  toObject: { virtuals: true },
})
export class Lead extends Document {
  // ─── Basic Lead Information ────────────────────────────────────────
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, min: 0 })
  budget: number; // in PKR or your currency

  @Prop({ required: true, trim: true })
  location: string; // e.g. "DHA Phase 8", "Clifton", "Gulshan-e-Iqbal"

  @Prop({
    required: true,
    enum: ['Apartment', 'House', 'Plot', 'Commercial', 'Penthouse', 'Farmhouse', 'Other'],
  })
  propertyType: string;

  @Prop({
    required: true,
    enum: [
      'Immediate',
      '1-3 months',
      '3-6 months',
      '6-12 months',
      '12+ months',
      'Flexible',
    ],
  })
  timeline: string;

  // ─── Lead Status & Lifecycle ───────────────────────────────────────
  @Prop({
    type: String,
    enum: ['new', 'verified', 'contacted', 'purchased', 'sold', 'expired', 'rejected'],
    default: 'new',
    index: true,
  })
  status: string;

  // ─── Ownership & Creation ──────────────────────────────────────────
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  createdBy: Types.ObjectId; // Admin or Marketer who created/submitted the lead

  @Prop({ type: Date, default: Date.now })
  submittedAt?: Date; // When marketer submitted (if different from creation)

  // ─── Purchase & Exclusivity ────────────────────────────────────────
  @Prop({ type: Types.ObjectId, ref: 'User', index: true, sparse: true })
  purchasedBy?: Types.ObjectId; // Current broker who owns the lead

  @Prop({ type: Date })
  exclusivityEndDate?: Date; // null = never purchased or expired

  // ─── Additional Useful Fields ──────────────────────────────────────
  @Prop({ type: String, trim: true })
  notes?: string; // Internal notes (visible only to admin/marketer)

  @Prop({ type: Boolean, default: false })
  isHot?: boolean; // Marketer/admin can flag as high priority

  @Prop({ type: Number, default: 0 })
  viewCount: number; // How many brokers viewed it

  @Prop({ type: Number, default: 0 })
  purchaseAttempts: number; // Failed attempts counter (optional analytics)

  // ─── Soft delete / Archive ─────────────────────────────────────────
  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;

  @Prop({ type: Date })
  deletedAt?: Date;
}
 

export const LeadSchema = SchemaFactory.createForClass(Lead);