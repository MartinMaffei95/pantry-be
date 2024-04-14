import { Ingredient, RecipeResult } from 'src/recipe/entities';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:"products"})
export class Product {

  @PrimaryGeneratedColumn("increment")
  id:number

 
  @Column("text",{
    unique:true
  })
  name: string;

  @Column("text")
  type: string;

  @OneToMany(
    ()=>Ingredient,
    (ingredient)=>ingredient.product,
    {cascade:true,eager:true}
  )
    product?:Ingredient

    // @OneToOne(
    //   ()=>RecipeResult,
    //   (result)=>result.id,

    // )
    //  @JoinColumn()
    //  resultOf?:RecipeResult
}

