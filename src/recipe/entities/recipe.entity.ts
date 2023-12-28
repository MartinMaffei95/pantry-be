import { Product } from './../../product/entities/product.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
class StepRecipe {
  @Prop()
  title: string;
  @Prop()
  description: string;
  @Prop()
  step: number;
  @Prop()
  duration: number;
}

@Schema({ _id: false })
class Measurement {
  @Prop()
  meassurement: string;
  @Prop()
  quantity: number;
}

@Schema({ _id: false })
class IngredientRecipe extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  product: Product; //objectId;
  @Prop(Measurement)
  measurement: Measurement;
}

@Schema({ _id: false })
class IngredientRecipeExtended extends IngredientRecipe {
  @Prop([IngredientRecipe])
  replace_by: IngredientRecipe;
}

@Schema({ _id: false })
class Portions extends Measurement {
  @Prop()
  wight: number;
}

@Schema({ _id: false })
class RecipeResult extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  product: Product; //objectId

  @Prop(Measurement)
  yield: Measurement;
  @Prop(Portions)
  portion: Portions;
}

@Schema()
export class Recipe extends Document {
  @Prop()
  name: string;

  @Prop([IngredientRecipeExtended])
  ingredients: IngredientRecipeExtended;

  @Prop([StepRecipe])
  steps: StepRecipe;

  @Prop(RecipeResult)
  result: RecipeResult;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
