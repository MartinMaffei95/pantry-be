import { Inject, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { providersOpt } from 'src/configs/providers.config';
import { Model } from 'mongoose';
import { Recipe } from './entities/recipe.entity';

@Injectable()
export class RecipeService {
  constructor(
    @Inject(providersOpt['RECIPE_MODEL'])
    private recipeModel: Model<Recipe>,
  ) {}

  create(createRecipeDto: CreateRecipeDto) {
    const createdRecipe = new this.recipeModel(createRecipeDto);
    return createdRecipe.save();
  }

  findAll() {
    return this.recipeModel
      .find()
      .populate([
        { path: 'result', populate: { path: 'product' } },
        { path: 'ingredients', populate: { path: 'product' } },
      ])
      .exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} recipe`;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
