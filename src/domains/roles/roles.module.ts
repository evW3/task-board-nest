import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Permissions } from "./permissions.model";
import { RolesController } from "./roles.controller";
import { Roles } from "./roles.model";
import { RolesService } from "./roles.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Roles, Permissions])
    ],
    providers: [RolesService],
    controllers: [RolesController],
    exports: [RolesService]
})
export class RolesModule {}