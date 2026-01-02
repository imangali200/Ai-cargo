import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { CreateUser } from '../admin/dto/createUser.dto';
import { ConfigService } from '@nestjs/config';
import passport from 'passport';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}
  async findPhonenumber(phoneNumber: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { phoneNumber },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async createuser(registerDto: RegisterDto) {
    try {
      const createData = await this.userRepository.create({
        ...registerDto,
      });
      const saveUser = await this.userRepository.save(createData);
      if (!saveUser) throw new BadRequestException('User is not created');
      return saveUser;
    } catch (error) {
      throw error;
    }
  }
  async createByAdmin(createUser: CreateUser) {
    try {
      const createUserData = await this.userRepository.create({
        ...createUser,
      });
      const saveData = await this.userRepository.save(createUserData);
      if (!saveData) throw new BadRequestException('User is not created');
      return { message: 'created successfully' };
    } catch (error) {
      throw error;
    }
  }
  async findId(id: number) {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async findUsers() {
    try {
      const users = await this.userRepository.find();
      if (!users) throw new NotFoundException('No have users');
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getAdmins() {
    try {
      const admins = await this.userRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: 'admin' })
        .andWhere('user.branch IS NULL')
        .getMany();
      if (!admins || admins.length === 0)
        throw new NotFoundException('admin is not found');
      return admins;
    } catch (error) {
      throw error;
    }
  }

  async searchUsers(search: number) {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.name ILIKE :search', { search: `%${search}%` })
        .orWhere('CAST(user.role AS TEXT) ILIKE :search', {
          search: `%${search}%`,
        })
        .orWhere('user.surname ILIKE :search', { search: `%${search}%` })
        .orWhere('user.phoneNumber ILIKE :search', { search: `%${search}%` })
        .orWhere('user.id = :id', { id: search })
        .getMany();
      if (!users || users.length === 0)
        throw new NotFoundException('user is not found');
      return users;
    } catch (error) {
      throw error;
    }
  }

  async switchActive(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('User is not found');
      user.isActive = !user.isActive;
      await this.userRepository.save(user);
      return { message: 'User is activate switched successfully' };
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, updateData: Partial<UserEntity>) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      Object.assign(user, updateData);
      await this.userRepository.save(user);
      return { message: 'Updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getArchiveUsers() {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .withDeleted()
        .where('user.deletedAt IS NOT NULL')
        .getMany();
      if (!users.length) {
        throw new NotFoundException('There are no users in the archive');
      }
      return users;
    } catch (error) {
      throw error;
    }
  }

  async restoreUser(id: string) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .withDeleted()
        .where('user.id = :id', { id })
        .getOne();
      if (!user) throw new NotFoundException('User not found in archive');
      await this.userRepository.restore(id);
      return { message: 'user restore successfully' };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user)
        throw new BadRequestException('user is not have in the database');
      await this.userRepository.softDelete(id);
      return { message: 'user moved to archive' };
    } catch (error) {
      throw error;
    }
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
      throw error;
    }
  }

  async getMyLikes(id: number) {
    try {
      const posts = await this.userRepository.findOne({
        where: { id },
        relations: ['postLikes'],
      });
      if (!posts) throw new NotFoundException('post likes is dont find');
      return posts;
    } catch (error) {
      throw error;
    }
  }

  async getMyPosts(id: number) {
    try {
      const posts = await this.userRepository.findOne({
        where: { id },
        relations: ['posts'],
      });
      if (!posts) throw new NotFoundException('post is dont find');
      return posts;
    } catch (error) {
      throw error;
    }
  }


  async getProfile(id: number) {
    try {
      const profile = await this.userRepository.findOne({
        where: { id },
        relations: ['posts'],
        select: {
          id: true,
          name: true,
          surname: true,
        },
      });
      if (!profile) throw new NotFoundException('not found this user');
      return profile;
    } catch (error) {
      throw error;
    }
  }

  async myProfile(id: number) {
    try {
      const profile = await this.userRepository.findOne({
        where: { id },
        relations: ['postLikes', 'saved', 'posts'],
      });
      if (!profile) throw new NotFoundException('not found this user');
      delete profile.password;
      return profile;
    } catch (error) {
      throw error;
    }
  }
}
