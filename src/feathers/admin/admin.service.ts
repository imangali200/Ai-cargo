import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { ProductEntity } from 'src/core/db/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}
  async updateExcelFile(file: Express.Multer.File, time: string) {
    if (!time) throw new BadRequestException("You haven't time");
    const workbook = new ExcelJS.Workbook();

    const arrayBuffer = await file.buffer.buffer;
    await workbook.xlsx.load(arrayBuffer as ArrayBuffer);

    const worksheet = workbook.worksheets[0];
    console.log(worksheet);

    worksheet.eachRow(async (row) => {
      const value = String(row.getCell(1).value);
      const product = await this.productRepository.findOne({
        where: { productId: value },
      });
      if (product) {
        product.china_warehouse = new Date(time);
        await this.productRepository.save(product);
      }
    });
    return { message: 'Products updated with China arrival date' };
  }

  async inAiCargo(productId: string) {
    const product = await this.productRepository.findOne({
      where: { productId:productId },
    });
    if (!product) throw new NotFoundException('product is not found');
    product.aicargo = new Date();
    await this.productRepository.save(product);
    return { message: 'Products updated with ai cargo arrival date' };
  }

  async completeTracks(productId: string) {
    console.log(productId)
    const product = await this.productRepository.findOne({
      where: { productId:productId },
    });
    if (!product) throw new NotFoundException('product is not found');
    product.given_to_client = new Date();
    await this.productRepository.save(product);
    return { message: 'Products given to client' };
  }
}
