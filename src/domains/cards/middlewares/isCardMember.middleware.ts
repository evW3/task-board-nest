import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CardsMembersService } from '../cardsMembers.service';


@Injectable()
export class IsCardMemberMiddleware implements NestMiddleware {
  constructor(private readonly cardsMembersService: CardsMembersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.body?.userId;
      const cardId = Number.parseInt(req?.params?.cardId);
      const isUserAreMember = await this.cardsMembersService.findCardMember(userId, cardId);

      if(isUserAreMember.length >= 1)
        next();
      else
        next(new HttpException('U must be in member list of this card', HttpStatus.FORBIDDEN));
    } catch (e) {
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}