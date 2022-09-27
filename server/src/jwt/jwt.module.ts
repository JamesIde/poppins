import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/User';
import { JwtService } from './jwt.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
