import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { HashService } from 'src/hash/hash.service';
import { UserRepository } from 'src/repository/user.repository';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly userRepository: UserRepository,
  ) {}

  async signIn(signInDto: SignInDto, response: Response) {
    const { email, password } = signInDto;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await this.hashService.comparingPasswordWithHash(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { email: user.email, sub: user.id };

    const token = await this.jwtService.signAsync(payload);

    response.cookie('token', token, {
      secure: false,
      maxAge: 3600000,
    });

    return {
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        isDisabled: user.isDisabled,
        createdAt: user.createdAt,
      },
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const { username, email, password } = signUpDto;

    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword =
      await this.hashService.generateSaltAndHashingPassword(password);

    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }
}
