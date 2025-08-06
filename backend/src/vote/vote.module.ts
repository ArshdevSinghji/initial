import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { FeedbackRepository } from 'src/repository/feedback.repository';
import { UserRepository } from 'src/repository/user.repository';
import { VoteRepository } from 'src/repository/vote.repository';

@Module({
  controllers: [VoteController],
  providers: [VoteService, VoteRepository, UserRepository, FeedbackRepository],
})
export class VoteModule {}
