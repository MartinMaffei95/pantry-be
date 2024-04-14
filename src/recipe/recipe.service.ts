import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PaginationDto } from 'src/common/Dto/pagination.dto';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient, IngredientReplacement, Recipe, RecipeResult, RecipeStep } from './entities';
import { Repository } from 'typeorm';
import { handleDBExceptions } from 'src/common/error.handler';
import { Product } from 'src/product/entities/product.entity';
import { RecipeResultProduct } from 'src/common/entities/recipe-result-product.entity';
import { PaginatedData, PaginationInfo } from 'src/interfaces';
import { SearchDto } from 'src/common/Dto/search.dto';


@Injectable()
export class RecipeService {
  private readonly logger = new Logger(RecipeService.name);

  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,

    @InjectRepository(RecipeResult)
    private readonly recipeResultRepository: Repository<RecipeResult>,

    @InjectRepository(RecipeStep)
    private readonly recipeStepRepository: Repository<RecipeStep>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,

    // intermediate table recipe_result/product
    @InjectRepository(RecipeResultProduct)
    private readonly recipeResultProductRepository: Repository<RecipeResultProduct>,

    // intermediate table recipe_result/product
    @InjectRepository(IngredientReplacement)
    private readonly ingredientReplacement: Repository<IngredientReplacement>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto) {
    try {
      const { result, steps, ingredients, ...restOfRecipe } = createRecipeDto;

      const createIngredients =async ()=>{
        try {
          const ingredientsArray:Ingredient[]=[]
             for (let i = 0; i < ingredients.length; i++) {
              const ingredient = ingredients[i];
             
                const product = await this.productRepository.findOneBy({id:ingredient.product})
                console.log(product)
                if(!product) throw {code:"NOT_FOUND",detail:`Product ${ingredient.product} not found`}
                  const newIngredient = await this.ingredientRepository.create({
                    measurement_quantity: ingredient.measurement.quantity,
                    measurement_type: ingredient.measurement.measurement,
                    product: product
                  })

                  if(ingredient.replace_by && ingredient.replace_by.length > 0){
                    let replacements:IngredientReplacement[] =[]
                    for (let i = 0; i < ingredient.replace_by.length; i++) {
                      const replacement = ingredient.replace_by[i];
                      const replacementProduct = await this.productRepository.findOneBy({id:replacement.product})
                      if(!replacement.product) throw {code:"NOT_FOUND",detail:`Product replacement ${replacement.product} inside on ${ingredient.product} not found`}
                        
                      const replacementIngredient = await this.ingredientRepository.create({
                        measurement_quantity: replacement.measurement.quantity,
                        measurement_type: replacement.measurement.measurement,
                        product: replacementProduct
                      })

                      const replacementRegister = await this.ingredientReplacement.create({
                          replacement: replacementIngredient,
                          ingredient: newIngredient,
                        })
                      // Save the replacement in intermediate table "ingredients_replacements"
                      //await this.ingredientReplacement.save(replacementRegister)
                     replacements.push(replacementRegister)
                    }
                    newIngredient.replacements = replacements
                    console.log("newIngredient",newIngredient)
                  }
                  ingredientsArray.push(newIngredient)

             }
             return ingredientsArray
        } catch (error) {
          console.log("HUBO ERRORRRRR")
          throw error
        }
       
      }
    
      const ingredientsToSave = await createIngredients()
      console.log("NO HUBO ERERRO 2")

      const recipe = this.recipeRepository.create({
        ...restOfRecipe,
        ingredients:ingredientsToSave,
        steps: steps.map(
          step => this.recipeStepRepository.create({
            ...step
          })
        ),
      result: this.recipeResultRepository.create({
        // product:this.productRepository.create({name:result.product,type:"ELABORATED"}),
        portions_quantity: result.portion.quantity,
        portions_weight: result.portion.weight,
        result_weight: result.yield.quantity,
        portions_measurement:result.portion.measurement,
        result_measurement:result.yield.measurement,
      }),
      });

      //create on intermediate table
     const recipeResultProduct= await this.recipeResultProductRepository.create({
        product:{name:result.product,type:"ELABORATED"},
        recipe:recipe
      })

      //await this.recipeRepository.save(recipe)
       await this.recipeResultProductRepository.save(recipeResultProduct)

      return recipe;
    } catch (error) {
      handleDBExceptions(this.logger, error);
    }
  }

  async findAll(paginationDto: SearchDto) {
    const { limit = 10, offset = 1, search = '' } = paginationDto;

    try {
      const recipesQuery= await this.recipeRepository.createQueryBuilder("recipes")
      .andWhere("LOWER(name) LIKE :name ",{name:`%${search.toLowerCase()}%`})
      .take(limit)
      .skip((offset - 1) * limit)

      const reciepsFinded = await recipesQuery.getManyAndCount()
      // DETRUCTURATE
      const [products,count]= reciepsFinded
      const recipesResponse = this.paginate(
        {data:products,count,limit,offset}
      )
      
      return recipesResponse

 
    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
 
  }
  

  async findOne(id: number) {
    try {
      let recipe:Recipe

      let recipe_result:RecipeResultProduct
        const queryBuilder = this.recipeResultProductRepository.createQueryBuilder("recipe_results")
        recipe_result = await queryBuilder
        .where("recipe_results.recipe =:id", {id:id})
        .leftJoinAndSelect("recipe_results.recipe","recipe")
        .leftJoinAndSelect("recipe.result","result")

        .leftJoinAndSelect("recipe.ingredients","ingredients")
        .leftJoinAndSelect("ingredients.product","product")
        .getOne()
        

      recipe_result = await this.findDeepElaboratedProduct(recipe_result)
      recipe = recipe_result.recipe
      return recipe
    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
  }

  async getBasicIngredients(recipeId: string) {
    return 'findedProduct';
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }

  // recipe is a instace of recipe
  findDeepElaboratedProduct = async (recipe_result:RecipeResultProduct)=>{
    let sp:RecipeResultProduct
  
    for (let i = 0; i < recipe_result.recipe.ingredients.length; i++) {
      const ingredient = recipe_result.recipe.ingredients[i];

      if( ingredient.product.type ==="ELABORATED"){
        const productId= ingredient.product.id

        const subQuery =this.recipeResultProductRepository.createQueryBuilder("recipe_results")
        sp = await subQuery
        .where("recipe_results.product =:product_id", {product_id:productId})
        .leftJoinAndSelect("recipe_results.recipe","recipe")
        .leftJoinAndSelect("recipe.result","result")

        .leftJoinAndSelect("recipe.ingredients","ingredients")
        .leftJoinAndSelect("ingredients.product","product")
        .getOne()

        
        if(sp) {
        sp = await this.findDeepElaboratedProduct(sp)
        const newIngredient ={
          ...ingredient,
          resultOf:{...sp.recipe}
        }
        recipe_result.recipe.ingredients[i] = newIngredient}
     }
      
    }

    return recipe_result
  }

  paginate({data,count,offset,limit}:{data:Recipe[],count:number,offset:number,limit:number}):PaginatedData<Recipe[]>{
    const totalPages = Math.ceil(count / limit);
     // Calcular la página basada en el offset y el límite
    //  const page =  Math.min(Math.max(1, offset), totalPages);
    // console.log("count,offset,limit,",count,offset,limit)
    const page = offset

    let paginationInfo: PaginationInfo = {
       page: page,
       perPage: limit,
       totalPages: totalPages,
       totalElements: count,
       nextPage: page < totalPages ? page + 1 : null,
       prevPage: page > 1 ? page - 1 : null,
     };
   
    return { data: data, pagination: paginationInfo };

  }
}


