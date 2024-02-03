import { Inject, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { providersOpt } from 'src/configs/providers.config';
import mongoose, { Model, mongo } from 'mongoose';
import { Recipe } from './entities/recipe.entity';
import { PaginationDto } from 'src/common/Dto/pagination.dto';
import { PaginatedData, PaginationInfo } from 'src/interfaces';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { ProductService } from 'src/product/product.service';
import { Logger } from '@nestjs/common';
@Injectable()
export class RecipeService {
  private readonly logger = new Logger(RecipeService.name);

  constructor(
    private readonly productService: ProductService,
    @Inject(providersOpt['RECIPE_MODEL'])
    private recipeModel: Model<Recipe>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto) {
    const productName = createRecipeDto.result.product;
    const newRecipeId = new mongoose.Types.ObjectId().toString();
    this.logger.log(productName, newRecipeId);

    const newProduct: CreateProductDto = {
      name: productName,
      type: 'ELABORATED',
      resultOf: newRecipeId,
    };

    const prod = await this.productService.create(newProduct);

    const createdRecipe = new this.recipeModel({
      ...createRecipeDto,
      _id: newRecipeId,
      result: { ...createRecipeDto.result, product: prod._id },
    });
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
      .populate({
        
        path: 'ingredients',
        populate: {
          path: 'product',
          populate: { path: 'resultOf', populate: 'ingredients.product' },
        },
      })
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
