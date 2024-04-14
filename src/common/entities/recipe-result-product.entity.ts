import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from 'src/product/entities/product.entity';
import { Recipe, RecipeResult } from "src/recipe/entities";

@Entity({name:"recipes_products"})
export class RecipeResultProduct{
  @PrimaryGeneratedColumn("increment")
  id:number

  @OneToOne(
    ()=>Recipe,
    (result)=>result.id,
    { cascade: true,}
    )
  @JoinColumn({name:"recipe"})
  recipe:Recipe

    
  @OneToOne(
    ()=>Product,
    (product)=>product.id,
    { cascade: true,}
    )
  @JoinColumn({name:"product"})
    product:Product
}