import { Ingredient } from 'src/recipe/entities';
import {  Entity, JoinColumn, ManyToOne,  OneToOne,  PrimaryGeneratedColumn } from "typeorm";


@Entity({name:"ingredients_replacements"})
export class IngredientReplacement{

    @PrimaryGeneratedColumn("increment")
    id:number

    @OneToOne(
        ()=>Ingredient,
        (ingredient)=>ingredient.id
    )
    @JoinColumn({name:"ingredient"})
   ingredient:Ingredient

   @ManyToOne(
        ()=>Ingredient,
        (ingredient)=>ingredient.replacements
    )
    @JoinColumn({name:"replacement"})
   replacement:Ingredient
}