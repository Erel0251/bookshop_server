import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: any, res: any, next: () => void) {
    this.logger.log(`Request Info: ${req.method} ${req.url}`);

    res.on('finish', () => {
      this.logger.log(
        `Response Info: ${res.statusCode} ${res.statusMessage} ${res.message}`,
      );
    });

    next();
  }
}
