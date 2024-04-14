import {
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @IsString()
  @IsDefined()
  @IsIn(['BASIC', 'ELABORATED'])
  type: 'BASIC' | 'ELABORATED';
}
