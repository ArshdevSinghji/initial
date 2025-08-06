import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findUser(
    @Query('searchTerm') searchTerm?: string,
    @Query('limit') limit?: number,
  ) {
    return await this.userService.findUser(searchTerm, limit);
  }
}
