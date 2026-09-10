import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { // create new nest project using method of NestFactory.create
    instrument: ObserveInstrument,
  });
  await app.listen(process.env.PORT ?? 3000); // listen to the default port
}
await bootstrap(); // run the nest application
