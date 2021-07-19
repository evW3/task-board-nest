import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cards } from './cards.model';

@Entity()
export class CardsActivities {
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