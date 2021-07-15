 
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users/users.model';
import { Permissions } from './permissions.model';

@Entity()
export class Roles {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @ManyToMany(() => Permissions)
    @JoinTable({name: 'roles_permission'})
    rolePermissions: Permissions[];

    @OneToMany(() => Users, users => users.role)
    users: Users[];
}