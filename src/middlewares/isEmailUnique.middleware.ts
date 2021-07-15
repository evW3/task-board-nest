import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UsersService } from '../domains/users/users.service';

@Injectable()
export class IsEmailUniqueMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const isEmailUnique = await this.usersService.isUserExists(req.body.email);

      if(isEmailUnique) {
        next(new HttpException('Email already exists', HttpStatus.BAD_REQUEST));
      } else {
        next();
      }
    } catch (e) {
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }
}