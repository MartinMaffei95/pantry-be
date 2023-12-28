import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({
    index: true,
  })
  name: string;

  @Prop()
  type: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
