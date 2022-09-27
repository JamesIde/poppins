import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumberString()
  rating: number;
}
