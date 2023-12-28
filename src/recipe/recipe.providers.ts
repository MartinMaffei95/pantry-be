import { Connection } from 'mongoose';
import { providersOpt } from 'src/configs/providers.config';
import { RecipeSchema } from './entities/recipe.entity';

export const recipesProviders = [
  {
    provide: providersOpt['RECIPE_MODEL'],
    useFactory: (connection: Connection) =>
      connection.model('Recipe', RecipeSchema),
    inject: [providersOpt['DATABASE_CONNECTION']],
  },
];
