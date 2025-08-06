import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { UserModule } from './user/user.module';
import { FeedbackModule } from './feedback/feedback.module';
import { CommentModule } from './comment/comment.module';
import { TagModule } from './tag/tag.module';
import { VoteModule } from './vote/vote.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    FeedbackModule,
    CommentModule,
    TagModule,
    VoteModule,
    AuthModule,
  ],
})
export class AppModule {}
