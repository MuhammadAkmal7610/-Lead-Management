import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop({ enum: ['admin', 'broker', 'marketer'], required: true }) role: string;
  @Prop({ default: true }) isPaid: boolean;
   @Prop({ default: null }) userId: string; // Simulate paid registration
}

export const UserSchema = SchemaFactory.createForClass(User);