import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/reviews/entities/Review';
import { ReviewsService } from 'src/reviews/reviews.service';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/createProductDto';
import { UpdateProductDTO } from './dto/updateProductDto';
import { SingleProduct } from './dto/getProductDto';
import { Product } from './entities/Product';
@Injectable()
export class ProductService {
  @Inject(ReviewsService)
  private reviewService: ReviewsService;
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  findAllProducts({ take, skip, category }): Promise<Product[]> {
    // Take is the max number of records to return
    // Skip is the number of records to skip

    // Validate category filter
    if (this.isValidCategory(category)) {
      return this.productRepository.find({
        take: take,
        skip: skip,
        where: {
          productCategory: category,
        },
      });
    }

    // Else return all products
    return this.productRepository.find({
      take: take,
      skip: skip,
    });
  }

  async findSingleProduct(id: number): Promise<SingleProduct> {
    // Find all reviews associated with a product
    const reviews = await this.reviewService.findProductReviews(+id);
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    // Calculate average rating
    const averageRating = this.calculateAverageRating(reviews);

    return {
      product,
      reviews,
      averageRating: averageRating,
      reviewCount: reviews.length,
    };
  }

  async getProductCartValidation(id: number): Promise<boolean | Product> {
    if (!id) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Product ID is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
      select: {
        id: true,
        stockCount: true,
        productPrice: true,
        isStockAvailable: true,
        productName: true,
        productSlug: true,
        productImage: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    // In stock, price matches
    if (product.isStockAvailable) {
      return product;
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: ' Something went wrong, please try again later',
        },
        400,
      );
    }
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

  isValidCategory(category: string): boolean {
    const categories = ['Phone', 'Watch', 'iPad'];

    if (categories.includes(category)) {
      return true;
    }
    return false;
  }

  calculateAverageRating(reviews: Review[]) {
    let total = 0;
    reviews.forEach((review) => {
      total += review.rating;
    });
    return total / reviews.length;
  }
}
