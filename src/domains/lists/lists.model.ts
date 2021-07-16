import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Projects } from '../projects/projects.model';

@Entity()
export class Lists {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ generated: 'increment' })
  position: number;

  @ManyToOne(() => Projects, project => project.lists)
  @JoinColumn({name: 'project_id'})
  project: Projects;
}