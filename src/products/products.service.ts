import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProductDTO } from './dto/createProductDTO';
import { UpdateProductDTO } from './dto/updateProductDTO';
import { Product } from './entities/product';
import { v4 as uuidv4 } from 'uuid';
import { DeleteProductDTO } from 'src/shared/sharedProductType';
@Injectable()
export class ProductService {
  @InjectRepository(Product) private productRepository: Repository<Product>;

  findAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  findSingleProduct(id: number): Promise<Product> {
    return this.productRepository.findOneOrFail({
      where: {
        id: id,
      },
    });
  }

  createProduct(createProduct: CreateProductDTO): Promise<Product> {
    const newProduct = {
      name: createProduct.name,
      description: createProduct.description,
      price: createProduct.price,
    };

    console.log(newProduct);
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

    // Copy over the properties from the updateProduct object to the product object
    let updated = Object.assign(updateProduct, product);

    // Updaate the product
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
