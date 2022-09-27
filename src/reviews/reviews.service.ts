import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/createReviewDto';
import { UpdateReviewDto } from './dto/updateReviewDto';
import { Review } from './entities/Review';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {}
  createReview(@Req() req, createReviewDto: CreateReviewDto) {
    const productId = req.query.product;

    if (!productId || productId === 'undefined') {
      throw new NotFoundException(
        'A product id is required to leave a review.',
      );
    }

    // Create the new review
    const newReview = this.reviewRepository.create({
      ...createReviewDto,
      product: productId,
      user: req.user,
    });

    return this.reviewRepository.save(newReview);

    // return this.reviewRepository.save(review);
  }

  findAllReviews() {
    // TODO possible query runner to avoid returning password
    return this.reviewRepository.find({
      relations: ['user', 'product'],
    });
  }

  findOneReview(id: number) {
    return `This action returns a #${id} review`;
  }

  updateReview(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  deleteReview(id: number) {
    return `This action removes a #${id} review`;
  }
}
