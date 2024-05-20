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
//import { MongoConfigService } from './database/factories/mongo.typeorm-options.factory';
import { LoggerMiddleware } from './middleware/logger.middleware';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { AuthorModule } from './modules/author/author.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { SupplementModule } from './modules/supplement/supplement.module';
import { ReviewModule } from './modules/review/review.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { AdminModule } from './modules/admin/admin.module';

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
      envFilePath: ['.env.development'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgreConfigService,
      dataSourceFactory: async (options) => {
        return await new DataSource(options!).initialize();
      },
    }),
    // TypeOrmModule.forRootAsync({
    //   useClass: MongoConfigService,
    //   dataSourceFactory: async (options) => {
    //     return await new DataSource(options!).initialize();
    //   },
    // }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/database/schema/schema.gql'),
      playground: true,
    }),
    UserModule,
    AuthModule,
    AuthorModule,
    ReviewModule,
    CartModule,
    CategoryModule,
    PromotionModule,
    OrderModule,
    BookModule,
    SupplementModule,
    AdminModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, cors).forRoutes('*');
  }
}
