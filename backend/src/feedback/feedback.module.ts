import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackRepository } from 'src/repository/feedback.repository';
import { UserRepository } from 'src/repository/user.repository';
import { TagRepository } from 'src/repository/tag.repository';

@Module({
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    FeedbackRepository,
    UserRepository,
    TagRepository,
  ],
})
export class FeedbackModule {}
