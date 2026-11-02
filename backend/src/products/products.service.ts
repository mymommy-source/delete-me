import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type {
  Paginated,
  PaginationQueryDto,
} from '../common/dto/pagination-query.dto';
import { Product } from './product.schema';

export type ProductRecord = Product & { _id: string };

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async findAll({ page, limit }: PaginationQueryDto): Promise<Paginated<ProductRecord>> {
    const [items, total] = await Promise.all([
      this.productModel
        .find()
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<ProductRecord[]>()
        .exec(),
      this.productModel.countDocuments().exec(),
    ]);
    return { items, total, page, limit };
  }

  async findOne(id: string): Promise<ProductRecord> {
    const product = await this.productModel.findById(id).lean<ProductRecord>().exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
