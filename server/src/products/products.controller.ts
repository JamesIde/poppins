import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateProductDTO } from './dto/createProductDto';
import { SingleProduct } from './dto/getProductDto';
import { UpdateProductDTO } from './dto/updateProductDto';
import { Product } from './entities/Product';
import { ProductService } from './products.service';
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  getProducts(@Req() req: Request): Promise<Product[]> {
    return this.productService.findAllProducts(req);
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number): Promise<SingleProduct> {
    return this.productService.findSingleProduct(id);
  }

  @Get('validate/:id')
  validateProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean | Product> {
    return this.productService.getProductCartValidation(id);
  }

  @Post()
  createProduct(@Body() createProduct: CreateProductDTO): Promise<Product> {
    return this.productService.createProduct(createProduct);
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProduct: UpdateProductDTO,
  ): Promise<Product> | string {
    return this.productService.updateProduct(id, updateProduct);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}
