import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import 'colors';
async function bootstrap() {
  // TODO Enable cors when frontend
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  const port = process.env.PORT || 5000;
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  await app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`.cyan.underline);
  });
}
bootstrap();
