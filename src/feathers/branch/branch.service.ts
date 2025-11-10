import { InjectRepository } from '@nestjs/typeorm';
import { BranchesDto } from './dto/branches.dto';
import { BranchEntity } from 'src/core/db/entities/branch.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { ApiBody } from '@nestjs/swagger';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(BranchEntity)
    private readonly branchRepository: Repository<BranchEntity>,

    @InjectRepository(UserEntity)
    private readonly userRep: Repository<UserEntity>,
  ) {}

  async createBranch(branchesDto: BranchesDto) {
    try {
      const branchName = await this.branchRepository.findOne({
        where: { branchName: branchesDto.branchName },
      });
      if (branchName)
        throw new BadRequestException('branch is name already used');

      const [name, surname] = branchesDto.responsibleName.split(' ');

      const admin = await this.userRep
        .createQueryBuilder('user')
        .where('user.role = :role', { role: 'admin' })
        .andWhere('user.branch IS NULL')
        .andWhere('LOWER(user.name) = LOWER(:name)', { name })
        .andWhere('user.surname = :surname', { surname })
        .getOne();

      if (!admin) {
        throw new NotFoundException('admin is not found');
      }
      admin.branch = branchesDto.branchName;
      const branch = await this.branchRepository.create(branchesDto);
      await this.branchRepository.save(branch);
      await this.userRep.save(admin);
      return { message: 'New branch is created successfully' };
    } catch (error) {
      return { error };
    }
  }

  async getBranches() {
    try {
      const branches = await this.branchRepository
        .createQueryBuilder('branches')
        .where('branches.deleteAt IS NULL')
        .getMany();
      return branches;
    } catch (error) {}
  }

  async updateBranch(branchesDto: Partial<BranchesDto>, id: number) {
    try {
      const branch = await this.branchRepository.findOne({ where: { id } });
      if (!branch) throw new NotFoundException('branch is dont find');
      Object.assign(branch, branchesDto);
      await this.branchRepository.save(branch);
      return { message: 'updated successfully' };
    } catch (error) {
      return error;
    }
  }

  async trachBranches() {
    try {
      const datas = await this.branchRepository
        .createQueryBuilder('branches')
        .withDeleted()
        .where('branches.deleteAt IS NOT NULL')
        .getMany();
      if (!datas || datas.length === 0)
        throw new NotFoundException('there is no have datas');
      return datas;
    } catch (error) {
      return error;
      
    }
  }

  async deleteBranch(id: number) {
    try {
      const branch = await this.branchRepository.findOne({ where: { id } });
      if (!branch) throw new NotFoundException('Branch is not find');
      await this.branchRepository.softDelete(id);
      return { message: 'Branch deleted successfully' };
    } catch (error) {
      return error;
    }
  }
}
