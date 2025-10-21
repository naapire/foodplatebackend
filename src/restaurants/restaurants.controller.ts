// src/restaurants/restaurants.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from '../entities/restaurant.entity';
import { Express } from 'express';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create restaurant (multipart: image optional)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create restaurant payload (image optional)',
    schema: {
      type: 'object',
      properties: {
        restaurant_name: { type: 'string', example: 'Mama K Restaurant' },
        address: { type: 'string', example: 'No. 5 High Street' },
        location: { type: 'string', example: '5.6037, -0.1870' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() dto: CreateRestaurantDto, @UploadedFile() image?: Express.Multer.File): Promise<Restaurant> {
    const buffer = image ? image.buffer : undefined;
    return this.restaurantsService.create(dto, buffer);
  }

  @Get()
  @ApiOperation({ summary: 'List restaurants' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'q', required: false, example: 'Mama' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('q') q?: string,
  ) {
    return this.restaurantsService.findAll({ page, limit, q });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single restaurant' })
  @ApiParam({ name: 'id', required: true, description: 'Restaurant UUID' })
  async findOne(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantsService.findOne(id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update restaurant payload (image optional)',
    schema: {
      type: 'object',
      properties: {
        restaurant_name: { type: 'string', example: 'Mama K Updated' },
        address: { type: 'string', example: 'No. 2 New Street' },
        location: { type: 'string', example: '5.6037, -0.1870' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Restaurant> {
    const buffer = image ? image.buffer : undefined;
    return this.restaurantsService.update(id, dto, buffer);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete restaurant by id' })
  async remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }
}
