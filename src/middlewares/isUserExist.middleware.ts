import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../domains/users/users.service';

@Injectable()
export class IsUserExistMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req?.body?.email;
      const isUserExists = userEmail && await this.usersService.isUserExists(userEmail);
      if(isUserExists)
        next();
      else
        next(new HttpException(`Can\`t find user with this email: ${userEmail}`, HttpStatus.BAD_REQUEST));
    } catch (e) {
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}
