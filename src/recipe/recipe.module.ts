import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { DatabaseModule } from 'src/database/database.module';
import { recipesProviders } from './recipe.providers';
import { productsProviders } from 'src/product/product.providers';
import { ProductService } from 'src/product/product.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RecipeController],
  providers: [
    RecipeService,
    ProductService,
    ...recipesProviders,
    ...productsProviders,
  ],
})
export class RecipeModule {}
