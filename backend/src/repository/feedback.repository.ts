import { Injectable } from '@nestjs/common';
import { FeedbackStatus, VoteType } from 'src/enum';
import { CreateFeedbackDto } from 'src/feedback/dto/create-feedback.dto';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FeedbackRepository extends Repository<Feedback> {
  constructor(private dataSource: DataSource) {
    super(Feedback, dataSource.createEntityManager());
  }

  async findFeedbacks(
    search?: string,
    tags?: string[],
    author?: string[],
    score?: 'ASC' | 'DESC',
    feedbackId?: number,
    limit?: number,
    page?: number,
  ) {
    const qb = this.createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.author', 'author')
      .leftJoinAndSelect('feedback.tags', 'tags')
      .leftJoinAndSelect('feedback.comments', 'comments')
      .leftJoinAndSelect('comments.author', 'commentAuthor')
      .leftJoinAndSelect('comments.feedback', 'commentFeedback')
      .leftJoinAndSelect('comments.parent', 'parentComment')
      .leftJoinAndSelect('comments.replies', 'replies')
      .leftJoinAndSelect('replies.author', 'replyAuthor')
      .leftJoinAndSelect('feedback.votes', 'votes')
      .leftJoinAndSelect('votes.user', 'voteUser')
      .loadRelationCountAndMap(
        'feedback.upvoteCount',
        'feedback.votes',
        'votes',
        (qb) =>
          qb.andWhere('votes.type = :upvote', { upvote: VoteType.UPVOTE }),
      );

    if (search) {
      qb.where(
        'feedback.title ILIKE :search OR feedback.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (feedbackId) {
      qb.andWhere('feedback.id = :feedbackId', { feedbackId });
    }

    if (tags && tags.length > 0) {
      qb.andWhere('tags.name IN (:...tags)', { tags });
    }

    if (author && author.length > 0) {
      qb.andWhere('author.username IN (:...author)', { author });
    }

    if (score) {
      qb.orderBy('feedback.upvoteCount', score);
    }

    if (limit) {
      qb.take(limit);
    }

    if (page && limit) {
      qb.skip((page - 1) * limit);
    }

    const count = await qb.getCount();

    return {
      feedbacks: await qb.getMany(),
      count,
    };
  }

  async createFeedback(
    createFeedbackData: Omit<CreateFeedbackDto, 'tags'> & { tags: any[] },
  ) {
    const { authorId, tags, ...feedbackData } = createFeedbackData;

    const feedback = this.create({
      ...feedbackData,
      author: { id: authorId },
      tags: tags,
    });
    return await this.save(feedback);
  }

  async updateFeedbackStatus(feedbackId: number) {
    const feedback = await this.findOneBy({ id: feedbackId });
    if (!feedback) {
      throw new Error('Feedback not found');
    }

    feedback.status =
      feedback.status === FeedbackStatus.PRIVATE
        ? FeedbackStatus.PUBLIC
        : FeedbackStatus.PRIVATE;

    return await this.save(feedback);
  }
}
