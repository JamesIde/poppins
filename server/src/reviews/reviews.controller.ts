import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/createReviewDto';
import { UpdateReviewDto } from './dto/updateReviewDto';
import { jwtGuard } from 'src/shared/auth-guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(jwtGuard)
  create(@Req() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(req, createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAllReviews();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOneReview(+id);
  }
  @Get('product/:id')
  findProductReviews(@Param('id') id: string) {
    return this.reviewsService.findProductReviews(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.updateReview(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.deleteReview(+id);
  }
}
