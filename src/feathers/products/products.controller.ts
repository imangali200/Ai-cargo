import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Auth } from 'src/core/decorators/auth.decorators';
import { ProductDto } from './dto/create_product.dto';
import { UserRoles } from 'src/core/db/enums/user.enum';
import { ApiOperation } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({summary:'create products'})
  @Post()
  @Auth()
  async createProduct(@Body() productDto:ProductDto,@Req() req:any){
    const id = req.user.id
    return await this.productsService.createProduct(productDto,id)
  }

  @ApiOperation({summary:'restore products from archive'})
  @Post(':id/restore')
  @Auth()
  async restoreProduct(@Param('id') id:string , @Req() req:any){
    const userId = req.user.id
    return await this.productsService.restoreProduct(id,userId)
  }

  @ApiOperation({summary:'Get own products'})
  @Get('/my')
  @Auth()
  async getOwnProducts(@Req() req:any){
    const id = req.user.id
    return await this.productsService.getOwnProducts(id)
  }

  @ApiOperation({summary:'get archive products'})
  @Get('/archive')
  @Auth()
  async getArchives(@Req() req:any){
    const userId = req.user.id
    return await this.productsService.getArchives(userId)
  }

  @ApiOperation({summary:'search products'})
  @Get(':productId')
  async searchByAdmin(@Param('productId') productId:string){
    return await this.productsService.searchProducts(productId)
  }

  @ApiOperation({summary:'Delete products'})
  @Delete(":productId")
  @Auth()
  async deleteProduct(@Param('productId') productId:string, @Req() req:any){
    const userId = req.user.id
    return await this.productsService.deleteProduct(productId,userId)
  }

}
