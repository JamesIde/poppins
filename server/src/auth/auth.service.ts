import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/User';
import { JwtService } from 'src/jwt/jwt.service';
import { LogInUserDto } from './dto/loginUserDto';
import { LoggedInUserDto } from './dto/loggedInUserDto';
import { RegisterUserDto } from './dto/registerUserDto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async loginUser(res, loginUser: LogInUserDto): Promise<LoggedInUserDto> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUser.email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message:
            'No account found - please register or check the details entered',
        },
        400,
      );
    }

    // Bcrypt compare
    const validPassword = await bcrypt.compare(
      loginUser.password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid email or password, please try again.',
      });
    }

    res.cookie('odin', this.jwtService.generateRefreshToken(user), {
      httpOnly: true,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: this.jwtService.generateAccessToken(user),
    };
  }

  async registerUser(
    res,
    registerUser: RegisterUserDto,
  ): Promise<LoggedInUserDto> {
    const user = await this.userRepository.findOne({
      where: {
        email: registerUser.email,
      },
    });

    if (user) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'An account with this email already exists - please try logging in!',
      });
    }

    if (registerUser.password !== registerUser.confirmPassword) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Passwords do not match',
        },
        400,
      );
    }

    const hashedPassword = await bcrypt.hash(registerUser.password, 12);

    const newUser: User = await this.userRepository.create({
      name: registerUser.name,
      email: registerUser.email,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    if (!newUser) {
      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Something went wrong - please contact the system administrator',
      });
    }

    res.cookie('odin', this.jwtService.generateRefreshToken(newUser), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      accessToken: this.jwtService.generateAccessToken(newUser),
    };
  }

  async getMe(@Req() request) {
    const userId = request.user.id;
    // Map to avoid returning user password
    const mapUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['reviews'],
    });
    const user = {
      id: mapUser.id,
      name: mapUser.name,
      email: mapUser.email,
      tokenVersion: mapUser.tokenVersion,
      reviews: mapUser.reviews,
    };

    return user;
  }
}
