import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgreConfigService } from './database/factories/postgre.typeorm-options.factory';
import { DataSource } from 'typeorm';
import helmet from 'helmet';
import cors from 'cors';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { LoggerModule } from 'nestjs-pino';
import { RepositoryModule } from './modules/repository/repository.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongoConfigService } from './database/factories/mongo.typeorm-options.factory';
import { BookModule } from './modules/book/book.module';
import { RatingModule } from './modules/rating/rating.module';
import { AuthorModule } from './modules/author/author.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            timestampKey: 'time',
            messageKey: 'msg',
          },
        },
      },
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgreConfigService,
      dataSourceFactory: async (options) => {
        return await new DataSource(options!).initialize();
      },
    }),
    TypeOrmModule.forRootAsync({
      useClass: MongoConfigService,
      dataSourceFactory: async (options) => {
        return await new DataSource(options!).initialize();
      },
    }),
    RepositoryModule,
    UserModule,
    AuthModule,
    BookModule,
    RatingModule,
    AuthorModule,
    CartModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, helmet, cors).forRoutes('*');
  }
}
