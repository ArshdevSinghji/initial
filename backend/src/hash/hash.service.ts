import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async generateSaltAndHashingPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async comparingPasswordWithHash(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
