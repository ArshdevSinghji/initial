import { Body, Controller, Patch } from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Patch()
  async updateVote(@Body() createVoteDto: CreateVoteDto) {
    return this.voteService.updateVote(createVoteDto);
  }
}
