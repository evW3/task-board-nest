import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users/users.model';
import { Projects } from '../projects/projects.model';

@Entity()
export class Workplaces {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Users, user => user.workplaces)
  @JoinColumn({name:'user_id'})
  user: Users;

  @OneToMany( () => Projects, project => project.workplace )
  projects: Projects[];
}