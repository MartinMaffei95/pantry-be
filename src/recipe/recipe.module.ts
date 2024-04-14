import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient, IngredientReplacement, Recipe, RecipeResult, RecipeStep } from './entities';
import { Product } from 'src/product/entities/product.entity';
import { RecipeResultProduct } from 'src/common/entities/recipe-result-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Recipe,
    RecipeStep,
    RecipeResult,
    Product,
    Ingredient,
    IngredientReplacement,
    RecipeResultProduct
  ])],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
