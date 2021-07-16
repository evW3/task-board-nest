import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { RolesModule } from "../roles/roles.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { BcryptService } from "./bcrypt.service";
import { TokenService } from "./token.service";
import { UsersModule } from '../users/users.module';
import { IsUserExistMiddleware } from '../../middlewares/isUserExist.middleware';
import { IsEmailUniqueMiddleware } from '../../middlewares/isEmailUnique.middleware';

@Module({
    imports: [
      ConfigModule.forRoot({
          envFilePath: ['.env']
      }),
      JwtModule.register({
          secret: process.env.TOKEN_SECRET_KEY,
          signOptions: { expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN }
      }),
      RolesModule,
      forwardRef(() => UsersModule),
    ],
    controllers: [AuthController],
    providers: [AuthService, BcryptService, TokenService],
    exports: [TokenService]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(IsUserExistMiddleware)
      .forRoutes('auth/sign-in');
    consumer
      .apply(IsEmailUniqueMiddleware)
      .forRoutes('auth/sign-up');
  }

}