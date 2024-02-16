import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/decorators/guardToken';

import { BrandService } from './brand.service';
import { BrandDto } from './dto/brand';
import { CreateBrandDto } from './dto/createBrand';
import { UpdateBrandDto } from './dto/updateBrand';

@Controller('brand')
@ApiTags('Brand Controller')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create brand' })
  @ApiOkResponse({ type: BrandDto })
  @ApiBody({ type: CreateBrandDto })
  @Post()
  async createBrand(@Body() createBrand: CreateBrandDto) {
    return await this.brandService.createBrand(createBrand);
  }

  @ApiOperation({ summary: 'Get brand' })
  @ApiOkResponse({ type: BrandDto })
  @Get(':id')
  async findOneBrand(@Param('id', ParseUUIDPipe) id: string) {
    return await this.brandService.findOne(id);
  }

  @ApiOperation({ summary: 'Get all brand' })
  @ApiOkResponse({ type: BrandDto })
  @Get()
  async getAllBrand() {
    return await this.brandService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete brand' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @Delete(':id')
  async deleteBrand(@Param('id', ParseUUIDPipe) id: string) {
    return await this.brandService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update brand' })
  @ApiOkResponse({ type: BrandDto })
  @ApiBody({ type: UpdateBrandDto })
  @Patch('/update/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() brand: UpdateBrandDto,
  ) {
    return await this.brandService.updateBrand({
      where: id,
      data: brand,
    });
  }
}
