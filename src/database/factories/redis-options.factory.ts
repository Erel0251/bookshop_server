import {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createRedisOptions(): Promise<RedisModuleOptions> {
    return {
      config: {
        host: this.configService.get('redis.host'),
        port: this.configService.get('redis.port'),
        password: this.configService.get('redis.password'),
      },
    };
  }
}
