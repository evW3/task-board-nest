import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { Users } from './users.model';
import { UsersService } from './users.service';
import { TokenMiddleware } from '../../middlewares/token.middleware';
import { AuthModule } from '../auth/auth.module';
import { UsersQueryRunnerService } from './usersQueryRunner.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Users]),
        forwardRef(() => AuthModule)
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersQueryRunnerService],
    exports: [UsersService, UsersQueryRunnerService]
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(TokenMiddleware)
      .forRoutes({ path: '/users/**', method: RequestMethod.ALL });
  }
}