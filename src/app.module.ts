import cors from 'cors';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { LoggerModule } from 'nestjs-pino';

import configuration from './config/configuration';
import { PostgreConfigService } from './database/factories/postgre.typeorm-options.factory';
import { MongoConfigService } from './database/factories/mongo.typeorm-options.factory';
import { LoggerMiddleware } from './middleware/logger.middleware';

import { RepositoryModule } from './modules/repository/repository.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { RatingModule } from './modules/rating/rating.module';
import { AuthorModule } from './modules/author/author.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoryModule } from './modules/category/category.module';
import { SaleModule } from './modules/sale/sale.module';
import { OrderModule } from './modules/order/order.module';
import { SupplementModule } from './modules/supplement/supplement.module';

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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/database/schema/schema.gql'),
      playground: true,
    }),
    RepositoryModule,
    UserModule,
    AuthModule,
    AuthorModule,
    RatingModule,
    CartModule,
    CategoryModule,
    SaleModule,
    OrderModule,
    BookModule,
    SupplementModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, cors).forRoutes('*');
  }
}
