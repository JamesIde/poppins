import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUserDto';
import { LoggedInUserDto } from './dto/loggedInUserDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // <--- Authentication routes --->
  @Post('login')
  async login(@Body() createUser: CreateUserDto): Promise<LoggedInUserDto> {
    console.log('in controller', createUser);
    return this.authService.loginUser(createUser);
  }
}
