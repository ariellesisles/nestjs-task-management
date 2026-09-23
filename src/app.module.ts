import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

// Determine env file based on NODE_ENV
const getEnvFilePath = (): string => {
  const env = process.env.NODE_ENV;
  switch (env) {
    case 'production':
      return '.env.production';
    case 'test':
      return '.env.test';
    case 'staging':
      return '.env.staging';
    default:
      return '.env.development';
  }
};

@Module({
  imports: [
    // Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePath(),
      validationSchema: configValidationSchema,
    }),

    // Database Setup
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('DB_TYPE'),
        host: configService.getOrThrow<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.getOrThrow<string>('DB_NAME'),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        synchronize: configService.get<boolean>('DB_SYNC'),
        autoLoadEntities: true,
      }),
    }),
    //Features
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
