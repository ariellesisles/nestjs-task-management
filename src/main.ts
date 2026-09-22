import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

async function bootstrap() {
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

  await app.listen(process.env.PORT ?? 3000); // listen to the default port
}
bootstrap(); // run the nest application
