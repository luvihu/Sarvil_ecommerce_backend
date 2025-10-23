import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Project } from './Project';

@Entity("videos")
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  publicId: string;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column({ nullable: true })
  duration: number; // segundos

  @Column({ nullable: true })
  size: number; // bytes

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Project, project => project.videos, { onDelete: 'CASCADE' })
  project: Project;
}