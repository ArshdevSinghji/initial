import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentRepository } from 'src/repository/comment.repository';
import { FeedbackRepository } from 'src/repository/feedback.repository';
import { UserRepository } from 'src/repository/user.repository';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
    private readonly feedbackRepository: FeedbackRepository,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    const { userId, parentId, content } = createCommentDto;

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const parentComment = await this.commentRepository.findOne({
      where: { id: parentId },
      relations: ['feedback'],
    });

    let feedbackId: number;
    let parentCommentId: number | null = null;

    if (parentComment) {
      feedbackId = parentComment.feedback.id;
      parentCommentId = parentComment.id;
    } else {
      const feedback = await this.feedbackRepository.findOneBy({
        id: parentId,
      });
      if (!feedback) {
        throw new BadRequestException('Parent comment or feedback not found');
      }
      feedbackId = feedback.id;
    }

    const newComment = this.commentRepository.create({
      content,
      author: { id: userId },
      feedback: { id: feedbackId },
      ...(parentCommentId && { parent: { id: parentCommentId } }),
    });

    return await this.commentRepository.save(newComment);
  }
}
