import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './createReviewDto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
