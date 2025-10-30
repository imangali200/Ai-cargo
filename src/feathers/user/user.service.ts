import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { CreateUser } from './dto/createUser.dto';
import bcrypt from 'node_modules/bcryptjs';
import { ConfigService } from '@nestjs/config';
import { use } from 'passport';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}
  async findPhonenumber(phoneNumber: string) {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
    });
    return user;
  }
  async createuser(registerDto: RegisterDto, password: string) {
    const createData = await this.userRepository.create({
      ...registerDto,
      password: password,
    });
    const saveUser = await this.userRepository.save(createData);
    if (!saveUser) throw new BadRequestException('User is not created');
    return saveUser;
  }
  async createByAdmin(createUser: CreateUser) {
    const hashedPassword = await this.hashedPassword(createUser.password);
    const createUserData = await this.userRepository.create({
      ...createUser,
      password: hashedPassword,
    });
    const saveData = await this.userRepository.save(createUserData);
    if (!saveData) throw new BadRequestException('User is not created');
    return { message: 'created successfully' };
  }
  async findId(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findUsers() {
    const users = await this.userRepository.find();
    if (!users) throw new NotFoundException('No have users');
    return users;
  }

  async getAdmins() {
    try {
      const admins = await this.userRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: 'admin' })
        .andWhere('user.branch IS NULL')
        .getMany();
      if (!admins || admins.length ===0) throw new NotFoundException('admin is not found');
      return admins
    } catch (error) {
      return error
    }
  }

  async searchUsers(search: string) {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.name ILIKE :search', { search: `%${search}%` })
        .orWhere('CAST(user.role AS TEXT) ILIKE :search', {
          search: `%${search}%`,
        })
        .orWhere('user.surname ILIKE :search', { search: `%${search}%` })
        .orWhere('user.phoneNumber ILIKE :search', { search: `%${search}%` })
        .getMany();
      if (!users || users.length === 0)
        throw new NotFoundException('user is not found');
      return users;
    } catch (error) {
      console.log(error);
      return { message: 'error' };
    }
  }

  async switchActive(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('User is not found');
      user.isActive = !user.isActive;
      await this.userRepository.save(user);
      return { message: 'User is activate switched successfully' };
    } catch (error) {
      console.log(error);
      return { message: 'error' };
    }
  }

  async updateUser(id: string, updateData: Partial<UserEntity>) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateData);
    await this.userRepository.save(user);
    return { message: 'Updated successfully' };
  }

  async getArchiveUsers() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .withDeleted()
      .where('user.deletedAt IS NOT NULL')
      .getMany();
    if (!users.length) {
      throw new NotFoundException('There are no users in the archive');
    }
    return users;
  }

  async restoreUser(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .withDeleted()
      .where('user.id = :id', { id })
      .getOne();
    if (!user) throw new NotFoundException('User not found in archive');
    await this.userRepository.restore(id);
    return { message: 'user restore successfully' };
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new BadRequestException('user is not have in the database');
    await this.userRepository.softDelete(id);
    return { message: 'user moved to archive' };
  }

  async deleteArchiveUser(id: string) {
    try {
      const user = await this.userRepository
        .createQueryBuilder()
        .withDeleted()
        .where('user.id = :id', { id })
        .getOne();
  
      if (!user) throw new NotFoundException('User is id not found');
      await this.userRepository.delete(id);
      return { message: 'deleted successfully' };
    } catch (error) {
      return error
    }
  }

  async hashedPassword(password: string) {
    return await bcrypt.hash(
      String(password),
      Number(this.configService.get<number>('HASH_NUMBER')),
    );
  }
}
