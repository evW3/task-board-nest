import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../domains/auth/token.service';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token: string | undefined = req?.headers?.authorization?.split(' ')[1];
      if(token) {
        const params = this.tokenService.decryptToken(token);

        if(params.userId) {
          req.body = { ...req.body, ...params };
          next();
        } else
          next(new HttpException('Invalid token', HttpStatus.FORBIDDEN));
      } else
        next(new HttpException('Invalid token', HttpStatus.FORBIDDEN));

    } catch (e) {
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException('Invalid token', HttpStatus.FORBIDDEN));
    }
  }
}
