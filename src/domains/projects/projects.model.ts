import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Workplaces } from '../workplaces/workplaces.model';

@Entity()
export class Projects {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Workplaces, workplace => workplace.projects)
  @JoinColumn({name: 'workplace_id'})
  workplace: Workplaces;
}