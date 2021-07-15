import { HttpException, HttpStatus } from "@nestjs/common";
import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { SchemaValidatePipe } from "src/pipes/schemaValidate.pipe";
import { ROLES } from "src/utils/enums";
import { RolesService } from "../roles/roles.service";
import { Users } from "../users/users.model";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { BcryptService } from "./bcrypt.service";
import { AuthDto } from "./dto/auth.dto";
import { RegDto } from "./dto/reg.dto";
import { RegSchema } from "./schemas/reg.schema";
import { TokenService } from "./token.service";
import { AuthSchema } from './schemas/auth.schema';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly usersService: UsersService,
                private readonly tokenService: TokenService,
                private readonly bcryptService: BcryptService,
                private readonly rolesService: RolesService) {}

    @Post('sign-up')
    @UsePipes(new SchemaValidatePipe(RegSchema))
    async signUp(@Body() regDto: RegDto) {
        try {
            const cryptResult = await this.bcryptService.encrypt(regDto.password);
            const userEntity = new Users();
            const defaultRole = await this.rolesService.findRoleByName(ROLES.USER);
    
            userEntity.email = regDto.email;
            userEntity.full_name = regDto.fullName;
            userEntity.password = cryptResult.encryptedPassword;
            userEntity.password_salt = cryptResult.salt;
            userEntity.role = defaultRole;
            
            const newUserEntity = await this.usersService.saveUser(userEntity);
            const token = this.tokenService.createToken(newUserEntity.id);
        
            return { token };
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('sign-in')
    @UsePipes(new SchemaValidatePipe(AuthSchema))
    async signIn(@Body() authDto: AuthDto) {
      try {
        const userEntity = await this.usersService.findUserByEmail(authDto.email);
        const encryptedPassword = await this.bcryptService.encryptBySalt(authDto.password, userEntity.password_salt);

        if(userEntity.password === encryptedPassword) {
          const token = this.tokenService.createToken(userEntity.id);
          return { token };
        } else {
          throw new HttpException('Email or password isn`t correct', HttpStatus.BAD_REQUEST);
        }
      } catch (e) {
        if(e instanceof HttpException)
          throw e;
        else
          throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    }
}