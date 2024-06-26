import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ValidationError } from 'class-validator';
import { MongooseError } from 'mongoose';

export const handleHTTPError = (error: unknown) => {
  if (error instanceof HttpException) {
    throw new RpcException(new HttpException(error.message, error.getStatus()));
  } else if (error instanceof MongooseError) {
    throw new RpcException(
      new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
    );
  } else if (error instanceof ValidationError) {
    throw new RpcException(
      new HttpException(error.constraints, HttpStatus.UNPROCESSABLE_ENTITY),
    );
  } else {
    throw new RpcException(
      new HttpException(
        (error as any)?.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};
