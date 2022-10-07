import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LogInUserDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
