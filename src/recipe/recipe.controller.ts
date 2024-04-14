import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PaginationDto } from 'src/common/Dto/pagination.dto';
import { Logger } from '@nestjs/common';

@Controller('recipe')
export class RecipeController {
  private readonly logger = new Logger(RecipeController.name);
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    this.logger.log(createRecipeDto);
    return this.recipeService.create(createRecipeDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    this.logger.log("GET ALL");

    return this.recipeService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipeService.update(+id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipeService.remove(+id);
  }
}
