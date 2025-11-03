import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import bcrypt from 'node_modules/bcryptjs';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const checkPhoneNumber = await this.userService.findPhonenumber(
        registerDto.phoneNumber,
      );
      if (checkPhoneNumber)
        throw new BadRequestException(
          'Already this number have for the another user',
        );
      const hashPassword = await this.userService.hashedPassword(
        registerDto.password,
      );

      const createUser = await this.userService.createuser(
        registerDto,
        hashPassword,
      );
      if (!createUser) throw new BadRequestException('user cannot created');
      const tokens = await this.tokenService.createTokens(createUser);
      return tokens;
    } catch (error) {
      return error;
    }
  }
  async login(loginDto: LoginDto) {
    
    try {
      const user = await this.userService.findPhonenumber(loginDto.phoneNumber);
      if (!user) throw new NotFoundException('not found phone number');
      const isValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isValid) throw new BadRequestException('Invalid password');
      const tokens = await this.tokenService.createTokens(user);
      return tokens;
    } catch (error) {
      return error
    }
  }
}
