import {  BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/filters-dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { handleDBExceptions } from 'src/common/error.handler';
import { PaginatedData, PaginationInfo } from 'src/interfaces';

@Injectable()
export class ProductService {
  private readonly logger = new Logger("ProductService")


  constructor(
    @InjectRepository(Product) 
    private readonly productRepository:Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product= this.productRepository.create(createProductDto)

      await this.productRepository.save(product)
      return product
    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
  }

  async findAll(
    paginationDto: ProductFiltersDto,
  ) {
    try {
      const { limit = 10, offset = 1, search = '', type = '' } = paginationDto;

      // const [products,count]= await this.productRepository.findAndCount({
      //   take:limit,
      //   skip:(offset - 1) * limit,
      // })


      const productsQuery= await this.productRepository.createQueryBuilder("products")
      .andWhere("LOWER(name) LIKE :name ",{name:`%${search.toLowerCase()}%`})
      .take(limit)
      .skip((offset - 1) * limit)

      if(type.length > 0){
        productsQuery.andWhere("type = :type",{type: type.toUpperCase()})
      }

      const productsFinded = await productsQuery.getManyAndCount()
      // DETRUCTURATE
      const [products,count]= productsFinded
      const productsResponse = this.paginate(
        {data:products,count,limit,offset}
      )
      return productsResponse
    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  paginate({data,count,offset,limit}:{data:Product[],count:number,offset:number,limit:number}):PaginatedData<Product[]>{
    const totalPages = Math.ceil(count / limit);
     // Calcular la página basada en el offset y el límite
     //const page = Math.floor(offset / limit) + 1;
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
