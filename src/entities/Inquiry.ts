import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("inquiries")
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ length: 100, nullable: true })
  selectedPlan: string;

  @Column({ default: false })
  responded: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}