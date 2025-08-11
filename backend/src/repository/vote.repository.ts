import { Injectable } from '@nestjs/common';
import { VoteType } from 'src/enum';
import { CreateVoteDto } from 'src/vote/dto/create-vote.dto';
import { Vote } from 'src/vote/entities/vote.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class VoteRepository extends Repository<Vote> {
  constructor(private dataSource: DataSource) {
    super(Vote, dataSource.createEntityManager());
  }

  async updateVote(createVoteDto: CreateVoteDto) {
    const { userId, feedbackId } = createVoteDto;

    const existingVote = await this.findOne({
      where: { user: { id: userId }, feedback: { id: feedbackId } },
      relations: ['user', 'feedback'],
    });

    if (existingVote) {
      existingVote.type =
        existingVote.type === VoteType.UPVOTE
          ? VoteType.DOWNVOTE
          : VoteType.UPVOTE;
      return await this.save(existingVote);
    }

    const newVote = this.create({
      type: VoteType.UPVOTE,
      user: { id: userId },
      feedback: { id: feedbackId },
    });

    return await this.save(newVote);
  }
}
