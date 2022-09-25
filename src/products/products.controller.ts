import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LicoriceGuard } from 'src/shared/licorice.guard';
import { CreateProductDTO } from './dto/createProductDTO';
import { UpdateProductDTO } from './dto/updateProductDTO';
import { Product } from './entities/product';
import { ProductService } from './products.service';
@Controller('products')
export class ProductsController {
  constructor(private readonly ProductService: ProductService) {}
  @Get()
  getProducts(): Promise<Product[]> {
    return this.ProductService.findAllProducts();
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.ProductService.findSingleProduct(id);
  }

  @Post()
  @UseGuards(LicoriceGuard)
  createProduct(
    @Req() req,
    @Body() createProduct: CreateProductDTO,
  ): Promise<Product> {
    return this.ProductService.createProduct(req, createProduct);
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProduct: UpdateProductDTO,
  ): Promise<Product> {
    return this.ProductService.updateProduct(id, updateProduct);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.ProductService.deleteProduct(id);
  }
}
