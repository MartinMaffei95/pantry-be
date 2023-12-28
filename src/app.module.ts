import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [ConfigModule.forRoot(), ProductModule, RecipeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
