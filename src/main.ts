import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Logger
  const logger = new Logger();

  // create new nest project using method of NestFactory.create
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // init validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Automatically runs instanceToPlain on all HTTP responses
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // For URI versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Retrieve ConfigService instance
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3005);

  await app.listen(port); // listen to the default port
  logger.log(`==== Application Listening on port ${port} ====`);
}
bootstrap(); // run the nest application
