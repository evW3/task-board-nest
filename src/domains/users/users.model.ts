import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../roles/roles.model';
import { Workplaces } from '../workplaces/workplaces.model';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  password_salt: string;

  @Column()
  full_name: string;

  @ManyToOne(() => Roles, role => role.users)
  @JoinColumn({name: 'role_id'})
  role: Roles;

  @OneToMany( () => Workplaces, workplace => workplace.user)
  workplaces: Workplaces[];
}