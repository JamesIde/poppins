import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController], // Set of controllers in this module to be instantiated
  providers: [CatsService],
  // Prividors that will be instantiated by the Nest injector.
  exports: [CatsService], // Set of providers that will be exported and available to other modules
})
export class CatsModule {}
