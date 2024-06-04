import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    // get accessToken from the request header
    //request.headers.authorization = request.headers.authorization?.split(' ')[1];
    // check if the request is coming from the browser
    if (!request.headers.authorization) {
      request.headers.authorization = `Bearer ${request.cookies['accessToken']}`;
    }
    return request;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
