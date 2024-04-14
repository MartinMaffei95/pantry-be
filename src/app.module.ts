import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { RecipeModule } from './recipe/recipe.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConfigModule.forRoot({
    expandVariables: true,
  }),
    TypeOrmModule.forRoot({
      type:"postgres",
       host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
       port: process.env.DATABASE_URL ? undefined : +process.env.DB_PORT,
       database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
       username: process.env.DATABASE_URL ? undefined : process.env.DB_USERNAME,
       password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
      url: process.env.DATABASE_URL ? process.env.DATABASE_URL : undefined,
      autoLoadEntities:true,
      synchronize:!!process.env.DB_SYNCRONIZE
    }),
    ProductModule, RecipeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
