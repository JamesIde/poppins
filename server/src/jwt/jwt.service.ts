import { Injectable, Req } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/auth/entities/User';
import { Request } from 'express';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessTokenDTO } from 'src/auth/dto/accessTokenDto';
@Injectable()
export class JwtService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  generateAccessToken(user: User): string {
    return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '7d', // TODO change after testing
    });
  }

  generateRefreshToken(user: User): string {
    return jwt.sign(
      { id: user.id, tokenVersion: user.tokenVersion },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '7d',
      },
    );
  }

  async refreshAccessToken(@Req() request: Request): Promise<AccessTokenDTO> {
    const token = request.cookies.odin;

    if (!token) {
      throw new HttpException(
        {
          message: 'No token provided',
        },
        401,
      );
    }

    let payload: any = null;

    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw new HttpException(
        {
          message: error,
        },
        401,
      );
    }

    const validUser = await this.userRepository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!validUser || validUser.id !== payload.id) {
      throw new HttpException(
        {
          message: 'User not found with provided token, please try again',
        },
        401,
      );
    }

    if (validUser.tokenVersion !== payload.tokenVersion) {
      throw new HttpException(
        {
          message: 'Token version is invalid, please try again',
        },
        401,
      );
    }

    return {
      ok: true,
      accessToken: this.generateAccessToken(validUser),
    };
  }

  async revokeRefreshToken(@Req() request: Request): Promise<boolean> {
    const token = request.cookies.odin;

    if (!token) {
      throw new HttpException(
        {
          message: 'No token provided',
        },
        401,
      );
    }

    let payload: any = null;

    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw new HttpException(
        {
          message: error,
        },
        401,
      );
    }

    const validUser = await this.userRepository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!validUser || validUser.id !== payload.id) {
      throw new HttpException(
        {
          message: 'User not found with provided token, please try again',
        },
        401,
      );
    }

    if (validUser.tokenVersion !== payload.tokenVersion) {
      throw new HttpException(
        {
          message: 'Token version is invalid, please try again',
        },
        401,
      );
    }

    validUser.tokenVersion += 1;

    await this.userRepository.save(validUser);

    return true;
  }
}
