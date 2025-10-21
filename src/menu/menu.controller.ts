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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from '../entities/menu.entity';
import { Express } from 'express';

@ApiTags('Menus')
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

 @Post()
  @ApiOperation({ summary: 'Create menu' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create menu for resturants',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Breakfast Menu' },
        promotionDetails: { type: 'string', example: '20% off on pancakes' },
        is_available: { type: 'string', example: 'active' },
        restaurantId: { type: 'string', example: 'restaurant-uuid' },
        image: { type: 'string', format: 'binary' },
      },
      required: ['name', 'restaurantId'],
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  create(@Body() createMenuDto: CreateMenuDto, @UploadedFile() image?: Express.Multer.File) {
    const buffer = image ? image.buffer : undefined;
    return this.menuService.create(createMenuDto, buffer);
  }

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu by id' })
  @ApiParam({ name: 'id', required: true, description: 'Menu UUID' })
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update menu by id' })
  @ApiParam({ name: 'id', required: true, description: 'Menu UUID' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete menu by id' })
  @ApiParam({ name: 'id', required: true, description: 'Menu UUID' })
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
