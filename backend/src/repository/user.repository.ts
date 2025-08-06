import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUserByEmail(email: string) {
    return await this.findOne({ where: { email } });
  }

  async findUserById(id: number) {
    return await this.findOne({ where: { id } });
  }

  async findUser(searchTerm?: string, limit?: number) {
    const query = this.createQueryBuilder('user');
    if (searchTerm) {
      query.andWhere(
        'user.email ILIKE :searchTerm OR user.username ILIKE :searchTerm',
        {
          searchTerm: `%${searchTerm}%`,
        },
      );
    }
    if (limit) {
      query.take(limit);
    }
    return await query.getMany();
  }
}
