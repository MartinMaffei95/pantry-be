import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from 'src/product/entities/product.entity';

@Entity({name:"recipes_results"})
export class RecipeResult{
  @PrimaryGeneratedColumn("increment")
  id:number

  @OneToOne(
    ()=>Product,
    (product)=>product.id,
    { cascade: true,}
    )
  @JoinColumn({name:"result_product"})
  product:Product

  @Column("text")
  result_measurement:string

  @Column("float",{
      default:0
  })
  result_weight:number
  
  @Column("text")
  portions_measurement:string

  @Column("float",{
      default:0
  })
  portions_quantity:number

  @Column("float",{
      default:0
  })
  portions_weight:number

}