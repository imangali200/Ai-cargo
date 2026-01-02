import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/core/db/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/create_product.dto';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { ImportedTrackEntity } from 'src/core/db/entities/imported-track.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(ImportedTrackEntity)
    private readonly importedTrackRepository: Repository<ImportedTrackEntity>,
  ) {}

  async createProduct(productDto: ProductDto, userId: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User is not found');

      // Check if there's imported track data for this productId
      const importedTrack = await this.importedTrackRepository.findOne({
        where: { productId: productDto.productId },
      });

      const product = new ProductEntity();
      product.productId = productDto.productId;
      product.productName = productDto.productName;
      product.user = user;
      
      // Copy dates from imported track if exists
      if (importedTrack) {
        // Link this track to the user who claimed it
        importedTrack.user = user;
        await this.importedTrackRepository.save(importedTrack);
      }

      const saveProduct = await this.productRepository.save(product);
      if (saveProduct) return { message: 'created successfully' };
    } catch (error) {
      throw error;
    }
  }

  async restoreProduct(productId: string, id: string) {
    try {
      const product = await this.productRepository
        .createQueryBuilder('products')
        .withDeleted()
        .leftJoin('products.user', 'user')
        .where('products.productId = :productId',{productId})
        .andWhere('user.id = :id', { id })
        .getOne();

      if (!product) throw new NotFoundException('Empty product');
      await this.productRepository.restore(product.id)
      return {message:'Product is restored'}
    } catch (error) {
      throw error;
    }
  }

  async getOwnProducts(userid: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userid },
        relations: ['products'],
      });
      if (!user) throw new NotFoundException('Not found user');
      return user.products;
    } catch (error) {
      throw error;
    }
  }

  async getArchives(id: string) {
    try {
      const products = await this.productRepository
        .createQueryBuilder('products')
        .withDeleted()
        .leftJoin('products.user', 'user')
        .where('user.id = :id', { id })
        .andWhere('products.deleteAt IS NOT NULL')
        .getMany();
      if (!products) throw new NotFoundException('In archive no have products');
      return products;
    } catch (error) {
      throw error;
    }
  }

  async searchProducts(id: string) {
    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .where('product.productId LIKE :id',{id:`%${id}%`})
        .getMany()
      if (!product) throw new NotFoundException('product is not found');
      return product;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(productId: string, userId: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { productId, user: { id: userId } },
      });
      if (!product) throw new NotFoundException('Product not found');
      const productSave = await this.productRepository.softDelete(product.id);
  
      return { message: 'Deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
