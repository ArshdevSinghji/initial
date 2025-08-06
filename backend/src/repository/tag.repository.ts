import { Injectable } from '@nestjs/common';
import { Tag } from 'src/tag/entities/tag.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(private dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }

  async findTagsByFeedbackId(feedbackId: number) {
    return this.createQueryBuilder('tag')
      .leftJoinAndSelect('tag.feedbacks', 'feedback')
      .where('feedback.id = :feedbackId', { feedbackId })
      .getMany();
  }

  async findTagByName(name: string) {
    return this.findOne({ where: { name } });
  }

  async createTag(name: string) {
    const tag = this.create({ name });
    return this.save(tag);
  }
}
