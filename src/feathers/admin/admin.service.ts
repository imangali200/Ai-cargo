import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { ProductEntity } from 'src/core/db/entities/product.entity';
import { ImportedTrackEntity } from 'src/core/db/entities/imported-track.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ImportedTrackEntity)
    private readonly importedTrackRepository: Repository<ImportedTrackEntity>,
  ) {}
  async updateExcelFile(file: Express.Multer.File, time: string) {
    try {
      if (!time) throw new BadRequestException("You haven't time");
      const workbook = new ExcelJS.Workbook();

      const arrayBuffer = await file.buffer.buffer;
      await workbook.xlsx.load(arrayBuffer as ArrayBuffer);

      const worksheet = workbook.worksheets[0];

      const rows: string[] = [];
      worksheet.eachRow((row) => {
        const value = String(row.getCell(1).value);
        if (value && value.trim()) {
          rows.push(value.trim());
        }
      });

      for (const productId of rows) {
        // Save or update in imported_tracks table (for future users)
        let importedTrack = await this.importedTrackRepository.findOne({
          where: { productId },
        });
        
        if (importedTrack) {
          importedTrack.china_warehouse = new Date(time);
          await this.importedTrackRepository.save(importedTrack);
        } else {
          importedTrack = this.importedTrackRepository.create({
            productId,
            china_warehouse: new Date(time),
          });
          await this.importedTrackRepository.save(importedTrack);
        }

        // Also update existing user products if found
        const products = await this.productRepository.find({
          where: { productId },
        });
        for (const product of products) {
          product.china_warehouse = new Date(time);
          await this.productRepository.save(product);
        }
      }

      return { message: 'Products updated with China arrival date' };
    } catch (error) {
      throw error;
    }
  }

  async updateTarazExcelFile(file: Express.Multer.File, time: string) {
    try {
      if (!time) throw new BadRequestException("You haven't time");
      const workbook = new ExcelJS.Workbook();

      const arrayBuffer = await file.buffer.buffer;
      await workbook.xlsx.load(arrayBuffer as ArrayBuffer);

      const worksheet = workbook.worksheets[0];

      const rows: string[] = [];
      worksheet.eachRow((row) => {
        const value = String(row.getCell(1).value);
        if (value && value.trim()) {
          rows.push(value.trim());
        }
      });

      for (const productId of rows) {
        // Save or update in imported_tracks table (for future users)
        let importedTrack = await this.importedTrackRepository.findOne({
          where: { productId },
        });
        
        if (importedTrack) {
          importedTrack.aicargo = new Date(time);
          await this.importedTrackRepository.save(importedTrack);
        } else {
          importedTrack = this.importedTrackRepository.create({
            productId,
            aicargo: new Date(time),
          });
          await this.importedTrackRepository.save(importedTrack);
        }

        // Also update existing user products if found
        const products = await this.productRepository.find({
          where: { productId },
        });
        for (const product of products) {
          product.aicargo = new Date(time);
          await this.productRepository.save(product);
        }
      }

      return { message: 'Products updated with aicargo arrival date' };
    } catch (error) {
      throw error;
    }
  }

  


  async inAiCargo(productId: string) {
    try {
      // Save or update in imported_tracks table
      let importedTrack = await this.importedTrackRepository.findOne({
        where: { productId },
      });
      
      if (importedTrack) {
        importedTrack.aicargo = new Date();
        await this.importedTrackRepository.save(importedTrack);
      } else {
        importedTrack = this.importedTrackRepository.create({
          productId,
          aicargo: new Date(),
        });
        await this.importedTrackRepository.save(importedTrack);
      }

      // Also update existing user products if found
      const products = await this.productRepository.find({
        where: { productId },
      });
      for (const product of products) {
        product.aicargo = new Date();
        await this.productRepository.save(product);
      }

      return { message: 'Products updated with ai cargo arrival date' };
    } catch (error) {
      throw error;
    }
  }

  async completeTracks(productId: string) {
    try {
      // Save or update in imported_tracks table
      let importedTrack = await this.importedTrackRepository.findOne({
        where: { productId },
      });
      
      if (importedTrack) {
        importedTrack.given_to_client = new Date();
        await this.importedTrackRepository.save(importedTrack);
      } else {
        importedTrack = this.importedTrackRepository.create({
          productId,
          given_to_client: new Date(),
        });
        await this.importedTrackRepository.save(importedTrack);
      }

      // Also update existing user products if found
      const products = await this.productRepository.find({
        where: { productId },
      });
      for (const product of products) {
        product.given_to_client = new Date();
        await this.productRepository.save(product);
      }

      return { message: 'Products given to client' };
    } catch (error) {
      throw error;
    }
  }

  async getAllImportedTracks() {
    try {
      const tracks = await this.importedTrackRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
      return tracks;
    } catch (error) {
      throw error;
    }
  }

  async searchImportedTrack(productId: string) {
    try {
      const tracks = await this.importedTrackRepository
        .createQueryBuilder('track')
        .leftJoinAndSelect('track.user', 'user')
        .where('track.productId LIKE :productId', { productId: `%${productId}%` })
        .orderBy('track.createdAt', 'DESC')
        .getMany();
      return tracks;
    } catch (error) {
      throw error;
    }
  }

  // Sync existing products with imported tracks (link users)

}
