import {
  Controller,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInUserDto } from './dto/loginUserDto';
import { LoggedInUserDto } from './dto/loggedInUserDto';
import { RegisterUserDto } from './dto/registerUserDto';
import { jwtGuard } from 'src/shared/auth-guard';
import { User } from './entities/User';
import { JwtService } from 'src/jwt/jwt.service';
import { AccessTokenDTO } from './dto/accessTokenDto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  /*<--- Authentication routes --->*/
  @Post('login')
  async login(
    @Res({ passthrough: true }) res,
    @Body() loginUser: LogInUserDto,
  ): Promise<LoggedInUserDto> {
    return this.authService.loginUser(res, loginUser);
  }

  @Post('register')
  async register(
    @Res({ passthrough: true }) res,
    @Body() registerUser: RegisterUserDto,
  ): Promise<LoggedInUserDto> {
    return this.authService.registerUser(res, registerUser);
  }

  @Get('me')
  @UseGuards(jwtGuard)
  async getMe(@Req() req) {
    return this.authService.getMe(req);
  }

  /*<--- Token refresh and revoking routes --->*/
  @Get('refresh_token')
  async refreshAccessToken(@Req() req): Promise<AccessTokenDTO> {
    return this.jwtService.refreshAccessToken(req);
  }

  @Get('revoke_token')
  async revokeRefreshToken(@Req() req): Promise<boolean> {
    return this.jwtService.revokeRefreshToken(req);
  }
}
