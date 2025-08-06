import { Comment } from 'src/comment/entities/comment.entity';
import { FeedbackStatus } from 'src/enum';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import { Vote } from 'src/vote/entities/vote.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: FeedbackStatus })
  status: FeedbackStatus;

  @Column({ default: false })
  isHidden: boolean;

  @ManyToOne(() => User, (user) => user.feedbacks)
  author: User;

  @ManyToMany(() => Tag, (tag) => tag.feedbacks, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.feedback)
  comments: Comment[];

  @OneToMany(() => Vote, (vote) => vote.feedback)
  votes: Vote[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
