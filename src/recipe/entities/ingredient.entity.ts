import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipe.entity";
import { Measurements } from "src/interfaces";
import { IngredientReplacement } from "./ingredient-replacement.entity";


@Entity({name:"ingredients"})
export class Ingredient{

    @PrimaryGeneratedColumn("increment")
    id:number

    @ManyToOne(
        ()=>Product,
        (product)=>product.id,
    )
    @JoinColumn({name:"product"})
    product:Product

    @Column("text")
    measurement_type:Measurements
  
    @Column("float",{
        default:0
    })
    measurement_quantity:number

    @ManyToOne(
        ()=>Recipe,
        (recipe)=>recipe.id,
    )
    @JoinColumn({name:"recipe"})
    recipe:Recipe

    @OneToMany(
        ()=>IngredientReplacement,
        (replacement)=>replacement.ingredient,
    )
    @JoinColumn({name:"replacements"})
    replacements:IngredientReplacement[]


}