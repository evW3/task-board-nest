import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Projects } from '../projects/projects.model';
import { Cards } from '../cards/cards.model';

@Entity()
export class Lists {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  position: number;

  @ManyToOne(() => Projects, project => project.lists)
  @JoinColumn({name: 'project_id'})
  project: Projects;

  @OneToMany(() => Cards, card => card.list)
  cards: Cards[]
}