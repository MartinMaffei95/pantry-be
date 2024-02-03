import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Recipe } from 'src/recipe/entities/recipe.entity';

@Schema()
export class Product extends Document {
  @Prop({
    index: true,
  })
  name: string;

  @Prop()
  type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Recipe' })
  resultOf?: Recipe;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
