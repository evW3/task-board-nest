import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Workplaces } from '../workplaces/workplaces.model';
import { Users } from '../users/users.model';

@Entity()
export class Projects {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Workplaces, workplace => workplace.projects)
  @JoinColumn({name: 'workplace_id'})
  workplace: Workplaces;

  @ManyToMany(() => Users)
  @JoinTable({name: "projects_members"})
  users: Users[];
}