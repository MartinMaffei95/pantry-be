import { Inject, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { providersOpt } from 'src/configs/providers.config';
import { Model } from 'mongoose';
import { Recipe } from './entities/recipe.entity';
import { PaginationDto } from 'src/common/Dto/pagination.dto';
import { PaginatedData, PaginationInfo } from 'src/interfaces';

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

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedData<Recipe[]>> {
    const { limit = 10, page = 1 } = paginationDto;

    const totalProducts = await this.recipeModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await this.recipeModel
      .find()
      .populate([
        { path: 'result', populate: { path: 'product' } },
        { path: 'ingredients', populate: { path: 'product' } },
      ])
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    let paginationInfo: PaginationInfo = {
      page: page,
      perPage: limit,
      totalPages: totalPages,
      totalProducts: totalProducts,
      nextPage: null,
      prevPage: null,
    };

    if (page < totalPages) {
      paginationInfo.nextPage = `/products?page=${page + 1}&limit=${limit}`;
    }

    if (page > 1) {
      paginationInfo.prevPage = `/products?page=${page - 1}&limit=${limit}`;
    }
    return { data: products, pagination: paginationInfo };
  }

  async findOne(id: string) {
    const findedProduct = await this.recipeModel
      .findById(id)
      .populate([
        { path: 'result', populate: { path: 'product' } },
        { path: 'ingredients', populate: { path: 'product' } },
      ])
      .exec();
    return findedProduct;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
