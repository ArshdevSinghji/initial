import { IsInt } from 'class-validator';

export class CreateVoteDto {
  @IsInt()
  userId: number;

  @IsInt()
  feedbackId: number;
}
