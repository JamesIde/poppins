import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/createProductDTO';
import { UpdateProductDTO } from './dto/updateProductDTO';
import { Product } from './entities/Product';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}
  findAllProducts({ take, skip }): Promise<Product[]> {
    // Take is the max number of records to return
    // Skip is the number of records to skip
    return this.productRepository.find({
      take: take,
      skip: skip,
      relations: {
        reviews: true,
      },
    });
  }

  async findSingleProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  createProduct(createProduct: CreateProductDTO): Promise<Product> | any {
    const productExist = this.productRepository.findOne({
      where: {
        productName: createProduct.productName,
      },
    });
    if (productExist) {
      throw new HttpException('Product already exist', HttpStatus.BAD_REQUEST);
    }
    // Generate slug
    const slug = this.slugify(createProduct.productName);

    // Construct the new product
    const newProduct = this.productRepository.create({
      productName: createProduct.productName,
      productSlug: slug,
      productDescription: createProduct.productDescription,
      productPrice: createProduct.productPrice,
      productImage: createProduct.productImage,
      productCategory: createProduct.productCategory,
      productBrand: createProduct.productBrand,
      stockCount: createProduct.stockCount,
    });

    return this.productRepository.save(newProduct);
  }

  slugify(string: string): string {
    return string
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&/g, '-and-')
      .replace(/[\s\W-]+/g, '-');
  }

  updateProduct(
    id: number,
    updateProduct: UpdateProductDTO,
  ): Promise<any> | any {
    return 'this will be worked on with admin portal';
  }

  async deleteProduct(id: number): Promise<any> {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    try {
      await this.productRepository.delete(id);
      return {
        message: 'Product deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
