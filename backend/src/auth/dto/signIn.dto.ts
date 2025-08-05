import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from './signUp.dto';

export class SignInDto extends PartialType(SignUpDto) {}
