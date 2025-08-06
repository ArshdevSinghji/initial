import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUser(searchTerm?: string, limit?: number) {
    return await this.userRepository.findUser(searchTerm, limit);
  }
}
