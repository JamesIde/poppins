import { IsNumber, IsNumberString, IsString } from 'class-validator';
export class UpdateProductDTO {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumberString()
  price: number;
}
