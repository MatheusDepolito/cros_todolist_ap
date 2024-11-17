import { map, catchError, Observable, throwError } from 'rxjs';
import {
  CrosToDoListSuccesResponseDTO,
  CrosToDoListControllerResponseDTO,
} from '@cros_todolist/dtos';
import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class CrosToDoListInterceptor implements NestInterceptor {
  intercept(c: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((e) => {
        return throwError(() => errorResponse(e));
      }),
      map((r) => {
        return successResponse(r);
      }),
    );
  }
}

function errorResponse(error: Error) {
  if (!error) {
    throw new InternalServerErrorException({
      error: 'Internal Server Error',
      statusCode: 500,
      messages: ['Internal Server Error'],
    });
  }

  throw new BadRequestException({
    error: 'Bad Request',
    statusCode: 400,
    messages: [error.message],
  });
}

function successResponse(
  response: CrosToDoListControllerResponseDTO,
): CrosToDoListSuccesResponseDTO {
  if (!response) return {};

  const { data } = response;

  if (!data) return { data: [] };

  const successResponse: CrosToDoListSuccesResponseDTO = {
    data: Array.isArray(data) ? data : [data],
  };

  return successResponse;
}
