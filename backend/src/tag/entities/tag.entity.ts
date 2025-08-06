import { Feedback } from 'src/feedback/entities/feedback.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Feedback, (feedback) => feedback.tags)
  feedbacks: Feedback[];
}
