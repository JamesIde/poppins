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
import { CreateProductDTO } from './dto/createProductDTO';
import { UpdateProductDTO } from './dto/updateProductDTO';
import { Product } from './entities/Product';
import { ProductService } from './products.service';
@Controller('products')
export class ProductsController {
  constructor(private readonly ProductService: ProductService) {}
  @Get()
  getProducts(@Req() req: Request): Promise<Product[]> {
    return this.ProductService.findAllProducts({
      take: req.query.hasOwnProperty('take') ? req.query.take : 10,
      skip: req.query.hasOwnProperty('skip') ? req.query.skip : 0,
    });
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.ProductService.findSingleProduct(id);
  }

  @Post()
  createProduct(@Body() createProduct: CreateProductDTO): Promise<Product> {
    return this.ProductService.createProduct(createProduct);
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProduct: UpdateProductDTO,
  ): Promise<Product> | string {
    return this.ProductService.updateProduct(id, updateProduct);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.ProductService.deleteProduct(id);
  }
}
