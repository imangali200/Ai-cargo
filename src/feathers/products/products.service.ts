import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/core/db/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/create_product.dto';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { use } from 'passport';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createProduct(productDto: ProductDto, userId: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User is not found');

    const product = await this.productRepository.create({
      ...productDto,
      user: user,
    });
    const saveProduct = await this.productRepository.save(product);
    if (saveProduct) return { message: 'created successfully' };
    } catch (error) {
      return error
    }
    
  }
  async getProducts() {
    try {
      const products = await this.productRepository.find();
      if (!products || products.length === 0)
        throw new NotFoundException('Still no have product');
      return products;
    } catch (error) {
      return error
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
      console.log(error);
      return { message: 'Error' };
    }
  }

  async getOwnProducts(userid: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userid },
        relations: ['products'],
      });
      if (!user) throw new NotFoundException('Not found user');
      return user.products;
    } catch (error) {
      return error
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
      return error
    }
  }

  async searchProducts(id: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { productId: id },
      });
      if (!product) throw new NotFoundException('product is not found');
      return product;
    } catch (error) {
      return error
    }
  }

  async deleteProduct(productId: string, userId: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { productId, user: { id: userId } },
      });
      if (!product) throw new NotFoundException('Product not found');
      const productSave = await this.productRepository.softDelete(product.id);
  
      return { message: 'Deleted successfully' };
    } catch (error) {
      return error
    }
  }
}
