import { Body, Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async getProfile(@Body('userId') userId: number) {
    try {
      return await this.usersService.findUserById(userId);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}