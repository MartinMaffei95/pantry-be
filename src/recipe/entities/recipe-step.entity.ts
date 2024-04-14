import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipe.entity";

@Entity({name:"recipes_steps"})
export class RecipeStep{
  @PrimaryGeneratedColumn("increment")
  id:number
  
  @Column("float",{
      default:0
  })
  order:number

  @Column("text")
  title?:string

  @Column("text")
  text?:string

  @Column("text",{
    nullable:true
  })
  image?:string 

  @ManyToOne(
      ()=>Recipe,
      (recipe)=>recipe.steps,
      {onDelete:"CASCADE"}
  )
  recipe:number
}