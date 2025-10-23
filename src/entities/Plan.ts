import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity("plans")
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json' })
  deliverables: string[];

  @Column({ length: 100 })
  priceRange: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, user => user.id, { onDelete: 'SET NULL' })
  createdBy?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}