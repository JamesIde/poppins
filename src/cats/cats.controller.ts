import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CatDto } from './catDto';
// import { ValidationPipe } from './catDto.validation.pipe';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private catService: CatsService) {}
  // This method returns JSON
  //   @Get()
  //   findAll(@Req() request: Request, @Res() response: Response): any {
  //     // return 'This returns cats!';
  //     return response
  //       .status(HttpStatus.OK)
  //       .json({ message: 'This returns cats' });
  //   }

  // This method returns a string
  @Get('string')
  findAllString(): string {
    return 'This returns cats!';
  }

  // This method captures the catsDto?
  @Post()
  async createCat(@Body() createCatDto: CatDto) {
    // throw new ForbiddenException();
    return this.catService.createCat(createCatDto);
  }
  @Get()
  async findAll(): Promise<CatDto[]> {
    return this.catService.findAllCats();
  }
  // This method will capture the route parameter
  // Find cat based off age param
  @Get(':age')
  async findSingleCat(
    @Param('age', ParseIntPipe) age: number,
  ): Promise<CatDto> {
    console.log('from controller', age);
    // try {
    return this.catService.findSingleCat(age);
    // } catch (error) {
    //   throw new HttpException('Cat not found', HttpStatus.NOT_FOUND);
    // }
  }
}
