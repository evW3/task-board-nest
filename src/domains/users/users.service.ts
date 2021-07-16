import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "./users.model";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private readonly usersRepository: Repository<Users>) {}

    async saveUser(user: Users): Promise<Users> {
        return await this.usersRepository.save(user);
    }

    async findUserByEmail(email: string): Promise<Users> {
      return await this.usersRepository.findOne({ where: { email } });
    }

    async findUserById(id: number): Promise<Users> {
      return await this.usersRepository.findOne({ where: { id } });
    }

    async isUserExists(email: string): Promise<boolean> {
      return await this.usersRepository.count({ where: { email } }) === 1;
    }
}