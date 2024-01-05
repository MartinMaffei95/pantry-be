import { IsIn, IsOptional, IsString, Min } from 'class-validator';
import { SearchDto } from 'src/common/Dto/search.dto';
import { productTypes } from 'src/configs/Generic.config';

export class ProductFiltersDto extends SearchDto {
  @IsOptional()
  @IsIn(productTypes)
  type?: 'BASIC' | 'ELABORATED';
}
