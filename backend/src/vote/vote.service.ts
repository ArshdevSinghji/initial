import { BadRequestException, Injectable } from '@nestjs/common';
import { VoteRepository } from 'src/repository/vote.repository';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UserRepository } from 'src/repository/user.repository';
import { FeedbackRepository } from 'src/repository/feedback.repository';

@Injectable()
export class VoteService {
  constructor(
    private readonly voteRepository: VoteRepository,
    private readonly userRepository: UserRepository,
    private readonly feedbackRepository: FeedbackRepository,
  ) {}

  async updateVote(createVoteDto: CreateVoteDto) {
    const { userId, feedbackId } = createVoteDto;

    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const feedback = await this.feedbackRepository.findFeedbacks(
      undefined,
      undefined,
      undefined,
      undefined,
      feedbackId,
    );

    if (!feedback.feedbacks || feedback.feedbacks.length === 0) {
      throw new BadRequestException('Feedback not found');
    }

    return this.voteRepository.updateVote(createVoteDto);
  }
}
