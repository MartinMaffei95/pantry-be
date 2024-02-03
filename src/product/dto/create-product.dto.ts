import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

// class MeasurementDto {
//   @IsString()
//   @IsDefined()
//   @IsIn(['gr', 'un', 'ml'])
//   measurement_type: 'gr' | 'un' | 'ml';

//   @IsInt()
//   @IsPositive()
//   @Min(1)
//   measurement_value: number;
// }

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @IsString()
  @IsDefined()
  @IsIn(['BASIC', 'ELABORATED'])
  type: 'BASIC' | 'ELABORATED';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  resultOf?: string;
  //   @IsInt()
  //   @IsPositive()
  //   @Min(0.0001)
  //   price: number;

  //   @IsDefined()
  //   @IsNotEmptyObject()
  //   @IsObject()
  //   @ValidateNested()
  //   @Type(() => MeasurementDto)
  //   measurement: MeasurementDto;
}
