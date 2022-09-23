import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  price: number;
}
