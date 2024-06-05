import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    if (status === 401) {
      return response.status(status).redirect('/login');
    } else if (status === 403) {
      return response.status(status).redirect('/login');
    } /* else if (status === 404) {
      return response.status(status).redirect('/not-found');
    } else if (status === 500) {
      return response.status(status).redirect('/server-error');
    }*/

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
