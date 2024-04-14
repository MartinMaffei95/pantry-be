import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RecipeStep } from "./recipe-step.entity";
import { RecipeResult } from "./recipe-result.entity";
import { Ingredient } from "./ingredient.entity";

@Entity({name:"recipes"})
export class Recipe{
  @PrimaryGeneratedColumn("increment")
  id:number

  @Column("text")
  name: string;


  @OneToMany(
      ()=>RecipeStep,
      (step)=>step.recipe,
      {cascade:true,eager:true}
  )
  steps?:RecipeStep[]

  @OneToOne(
    ()=>RecipeResult,
    (result)=>result.id,
    {cascade:true,eager:true}
  )
  @JoinColumn({name:"recipe_result"})
  result:RecipeResult

  @OneToMany(
    ()=>Ingredient,
    (ingredient)=>ingredient.recipe,
    {cascade:true,eager:true}
  )
  ingredients:Ingredient[]


  
}