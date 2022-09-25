import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto';
import { User } from './entities/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { LoggedInUserDto } from './dto/loggedInUserDto';
import { JwtService } from 'src/jwt/jwt.service';
@Injectable()
export class AuthService {
  @InjectRepository(User) private userRepository: Repository<User>;
  constructor(private jwtService: JwtService) {}
  async loginUser(createUser: CreateUserDto): Promise<LoggedInUserDto> {
    /*
    
    1. Check if user exists
    2. Has the password
    3. Create a JWT token
    4. Return the token with the user object

    */

    const user = await this.userRepository.findOne({
      where: {
        email: createUser.email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'No account found - please register or try again',
        },
        400,
      );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: this.jwtService.generateAccessToken(user),
    };
  }
}

// // Hash password
// const hashedPassword = await bcrypt.hash(createUser.password, 10);

// // Create a new user
// const newUser = this.userRepository.create({
//   name: createUser.name,
//   email: createUser.email,
//   password: hashedPassword,
// });
