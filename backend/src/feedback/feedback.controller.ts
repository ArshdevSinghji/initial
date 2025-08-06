import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  async findFeedbacks(
    @Query('search') search?: string,
    @Query('tags') tags?: string[],
    @Query('author') author?: string[],
    @Query('score') score?: 'ASC' | 'DESC',
    @Query('feedbackId') feedbackId?: number,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.feedbackService.findFeedbacks(
      search,
      tags,
      author,
      score,
      feedbackId,
      limit,
      page,
    );
  }

  @Patch('/:id/status')
  async updateStatus(@Param('id') id: string) {
    return this.feedbackService.updateFeedbackStatus(+id);
  }

  @Post()
  async createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(createFeedbackDto);
  }
}
