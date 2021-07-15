import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { Users } from "./users.model";
import { UsersService } from "./users.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users])
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}