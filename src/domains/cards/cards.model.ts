import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CardsAttachments } from './cardsAttachments.model';
import { CardsActivity } from './cardsActivity.model';
import { Users } from '../users/users.model';
import { Lists } from '../lists/lists.model';

@Entity()
export class Cards {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamptz' })
  date_interval_from: Date;

  @Column({ type: 'timestamptz' })
  date_interval_to: Date;

  @ManyToOne(() => Lists, list => list.cards)
  @JoinColumn({name: 'list_id'})
  list: Lists

  @OneToMany(() => CardsAttachments, attachment => attachment.card)
  attachments: CardsAttachments[];

  @OneToMany(() => CardsActivity, activity => activity.card)
  activities: CardsActivity[];

  @ManyToMany(() => Users)
  @JoinTable({name: 'cards_members'})
  users: Users[];

}