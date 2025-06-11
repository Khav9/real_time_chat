import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Channel } from './Channel';
import { User } from './User';
import { ApiProperty } from '@nestjs/swagger';

@Entity('messages')
export class Message {
  @ApiProperty({ description: 'Unique identifier of the message' })
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  message_id: number;

  @ApiProperty({ description: 'ID of the channel where the message was sent' })
  @Column({ type: 'bigint', unsigned: true })
  channel_id: number;

  @ApiProperty({ description: 'ID of the user who sent the message' })
  @Column({ type: 'bigint', unsigned: true })
  user_id: number;

  @ApiProperty({ description: 'Content of the message' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: 'Timestamp when the message was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Timestamp when the message was last updated' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Channel, (channel) => channel.channel_id)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.user_id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
