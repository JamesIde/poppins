import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CatDto {
  @IsString()
  name: string;
  @IsNotEmpty()
  age: number;
  @IsString()
  @IsNotEmpty()
  breed: string;
}
