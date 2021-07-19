import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Projects } from '../projects/projects.model';
import { Cards } from './cards.model';

@Entity()
export class CardsActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @ManyToOne(() => Cards, card => card.activities)
  @JoinColumn({name: 'card_id'})
  card: Cards;
}