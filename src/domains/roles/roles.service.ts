import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Roles } from "./roles.model";

@Injectable()
export class RolesService {
    constructor(@InjectRepository(Roles) private readonly rolesRepository: Repository<Roles>) {}

    async findRoleByName(name: string): Promise<Roles> {
        return await this.rolesRepository.findOne({
            where: { name }
        });
    }
}