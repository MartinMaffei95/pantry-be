import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { DatabaseModule } from 'src/database/database.module';
import { recipesProviders } from './recipe.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RecipeController],
  providers: [RecipeService, ...recipesProviders],
})
export class RecipeModule {}
