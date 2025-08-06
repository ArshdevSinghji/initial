import { BadRequestException, Injectable } from '@nestjs/common';
import { FeedbackRepository } from 'src/repository/feedback.repository';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UserRepository } from 'src/repository/user.repository';
import { TagRepository } from 'src/repository/tag.repository';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly userRepository: UserRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async findFeedbacks(
    search?: string,
    tags?: string[],
    author?: string[],
    score?: 'ASC' | 'DESC',
    feedbackId?: number,
    limit?: number,
    page?: number,
  ) {
    return this.feedbackRepository.findFeedbacks(
      search,
      Array.isArray(tags)
        ? tags.filter((tag): tag is string => typeof tag === 'string')
        : typeof tags === 'string'
          ? [tags]
          : [],
      Array.isArray(author)
        ? author.filter(
            (author): author is string => typeof author === 'string',
          )
        : typeof author === 'string'
          ? [author]
          : [],
      score,
      feedbackId,
      limit,
      page,
    );
  }

  async createFeedback(createFeedbackDto: CreateFeedbackDto) {
    const { authorId, tags } = createFeedbackDto;

    const user = await this.userRepository.findUserById(authorId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const uniqueTagNames = [...new Set(tags)];

    const tagEntities = await Promise.all(
      uniqueTagNames.map(async (tagName) => {
        const existingTag = await this.tagRepository.findTagByName(tagName);
        return existingTag
          ? existingTag
          : await this.tagRepository.createTag(tagName);
      }),
    );

    return this.feedbackRepository.createFeedback({
      ...createFeedbackDto,
      tags: tagEntities,
    } as any);
  }

  async updateFeedbackStatus(feedbackId: number) {
    return this.feedbackRepository.updateFeedbackStatus(feedbackId);
  }
}
