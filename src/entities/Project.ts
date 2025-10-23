import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Image } from './Image';
import { Video } from './Video';

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 50 })
  category: string;

  @Column({ default: true })
  isVisible: boolean;

  @OneToMany(() => Image, image => image.project, { cascade: true })
  images?: Image[];

  @OneToMany(() => Video, video => video.project, { cascade: true })
  videos?: Video[];

  @ManyToOne(() => User, user => user.id)
  createdBy?: User;

  // Helper methods
  get mainImage(): string | null {
    const activeImage = this.images?.find(img => img.isActive);
    return activeImage?.url || null;
  }

  get mainVideo(): string | null {
    const activeVideo = this.videos?.find(vid => vid.isActive);
    return activeVideo?.url || null;
  }
}