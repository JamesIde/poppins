import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/createProductDTO';
import { UpdateProductDTO } from './dto/updateProductDTO';
import { Product } from './entities/product';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}
  findAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
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

  createProduct(@Req() req, createProduct: CreateProductDTO): Promise<Product> {
    const newProduct = {
      name: createProduct.name,
      description: createProduct.description,
      price: createProduct.price,
    };

    return this.productRepository.save(newProduct);
  }

  updateProduct(id: number, updateProduct: UpdateProductDTO): Promise<any> {
    const product = this.productRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    // Copy to new object
    let updated = Object.assign(updateProduct, product);

    // Update the product
    return this.productRepository.update(id, updated);
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
