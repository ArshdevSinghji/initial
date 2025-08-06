import { VoteType } from 'src/enum';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: VoteType })
  type: VoteType;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Feedback, (feedback) => feedback.votes, {
    onDelete: 'CASCADE',
  })
  feedback: Feedback;
}
