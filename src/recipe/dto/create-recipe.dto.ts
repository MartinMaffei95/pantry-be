import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { measurements } from 'src/configs/Generic.config';
import { Measurements } from 'src/interfaces';
import { IsObjectId } from 'class-validator-mongo-object-id';

class StepRecipeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  title: string;

  @IsString()
  @MaxLength(150)
  description: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Min(1)
  step: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  duration?: string; //minutes
}

class MeasurementDto {
  @IsString()
  @IsDefined()
  @IsIn(measurements)
  meassurement: Measurements;

  @IsNumber()
  @IsPositive()
  @Min(0.1)
  quantity: number;
}

class IngredientRecipeDto {
  @IsNotEmpty()
  @IsObjectId()
  @IsString()
  product: string; // product id

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => MeasurementDto)
  measurement: MeasurementDto;
}

class IngredientRecipeDtoExtended extends IngredientRecipeDto {
  @IsArray()
  @Type(() => IngredientRecipeDto)
  @IsOptional()
  replace_by: IngredientRecipeDto[];
}

class PortionsDto extends MeasurementDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  weight: number;
}

class RecipeResultDto {
  @IsNotEmpty()
  @IsString()
  product: string; // product  name. Use the name to create a new elaborated PRODCUT

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => MeasurementDto)
  yield: MeasurementDto;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PortionsDto)
  portion: PortionsDto;
}

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => IngredientRecipeDtoExtended)
  ingredients: IngredientRecipeDtoExtended[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepRecipeDto)
  steps: StepRecipeDto[];

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => RecipeResultDto)
  result: RecipeResultDto;
}
