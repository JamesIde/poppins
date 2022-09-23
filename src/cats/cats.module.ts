import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController], // Set of controllers in this module to be instantiated
  providers: [CatsService],
  // Prividors that will be instantiated by the Nest injector.
  exports: [CatsService], // Set of providers that will be exported and available to other modules.
  // IF you dont want the CatsService to be accessable to other modules, you can omit the exports property.
  // But providers and controllers will still be instantiated.
})
export class CatsModule {}
