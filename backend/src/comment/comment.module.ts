import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from 'src/repository/comment.repository';
import { UserRepository } from 'src/repository/user.repository';
import { FeedbackRepository } from 'src/repository/feedback.repository';

@Module({
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentRepository,
    UserRepository,
    FeedbackRepository,
  ],
})
export class CommentModule {}
