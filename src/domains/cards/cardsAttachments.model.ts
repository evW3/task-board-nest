import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cards } from './cards.model';

@Entity()
export class CardsAttachments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attachment: string;

  @ManyToOne(() => Cards, card => card.attachments)
  @JoinColumn({name: 'card_id'})
  card: Cards;
}