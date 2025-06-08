import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  
  export enum ChannelType {
    TEXT = 'text',
    VOICE = 'voice',
  }
  
  @Entity('channels')
  export class Channel {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    channel_id: number;
  
    @Column({ type: 'bigint', unsigned: true })
    @Index('idx_server_id')
    server_id: number;
  
    @Column({ length: 100 })
    name: string;
  
    @Column({
      type: 'enum',
      enum: ChannelType,
    })
    type: ChannelType;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  