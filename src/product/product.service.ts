import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { providersOpt } from 'src/configs/providers.config';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/Dto/pagination.dto';
import { PaginatedData, PaginationInfo } from 'src/interfaces';
import { SearchDto } from 'src/common/Dto/search.dto';
import { ProductFiltersDto } from './dto/filters-dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(providersOpt['PRODUCT_MODEL'])
    private productModel: Model<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(
    paginationDto: ProductFiltersDto,
  ): Promise<PaginatedData<Product[]>> {
    const { limit = 10, page = 1, search = '', type = '' } = paginationDto;

    const likeSearchValue = new RegExp(search, 'i');
    const totalProducts = await this.productModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    const productsQuery: any = { name: likeSearchValue };

    if (type !== '') {
      productsQuery.type = type;
    }
    const products = await this.productModel
      .find(productsQuery)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate([
        { path: 'resultOf' },
        {
          path: 'resultOf',
          populate: { path: 'ingredients', populate: { path: 'product' } },
        },
      ])
      .exec();

    let paginationInfo: PaginationInfo = {
      page: page,
      perPage: limit,
      totalPages: totalPages,
      totalProducts: totalProducts,
      nextPage: null,
      prevPage: null,
    };

    if (page < totalPages) {
      paginationInfo.nextPage = `/products?page=${page + 1}&limit=${limit}`;
    }

    if (page > 1) {
      paginationInfo.prevPage = `/products?page=${page - 1}&limit=${limit}`;
    }
    return { data: products, pagination: paginationInfo };
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
}
