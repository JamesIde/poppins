import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LogInUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;
}
