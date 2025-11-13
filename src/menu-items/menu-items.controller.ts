import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MenuItemService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';

@ApiTags('Menu Items')
@Controller('menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  // ✅ Create a menu item under a specific restaurant and menu
  @Post()
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Add a menu item to a specific menu and restaurant',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Classic Pancakes' },
        price: { type: 'number', example: 7.99 },
        description: { type: 'string', example: 'Fluffy pancakes served with syrup' },
        is_available: { type: 'string', example: 'active' },
        image: { type: 'string', format: 'binary' },
      },
      required: ['name', 'price'],
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  create(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Body() createMenuItemDto: CreateMenuItemDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.menuItemService.create(restaurantId, menuId, createMenuItemDto, image);
  }

  // ✅ Get all items under a specific menu
  @Get()
  @ApiOperation({ summary: 'Get all menu items under a specific menu' })
  getMenuItems(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
  ) {
    return this.menuItemService.findByMenu(restaurantId, menuId);
  }

  // ✅ Get a single menu item by its ID
  @Get(':itemId')
  @ApiOperation({ summary: 'Get a single menu item by its ID' })
  @ApiParam({ name: 'itemId', description: 'UUID of the menu item' })
  getItem(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.menuItemService.findOne(restaurantId, menuId, itemId);
  }

  // ✅ Update a menu item
  @Patch(':itemId')
  @ApiOperation({ summary: 'Update a menu item by its ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update menu item details or image',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Pancakes' },
        price: { type: 'number', example: 8.99 },
        description: { type: 'string', example: 'Updated description' },
        is_available: { type: 'string', example: 'inactive' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  update(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Param('itemId') itemId: string,
    @Body() updateData: Partial<CreateMenuItemDto>,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.menuItemService.update(restaurantId, menuId, itemId, updateData, image);
  }

  // ✅ Delete a menu item
  @Delete(':itemId')
  @ApiOperation({ summary: 'Delete a menu item' })
  @ApiParam({ name: 'itemId', description: 'UUID of the menu item' })
  delete(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.menuItemService.delete(restaurantId, menuId, itemId);
  }

  // ✅ Get all menu items across all restaurants
  @Get()
  @ApiOperation({ summary: 'Get all menu items across all restaurants' })
  getAllMenuItems() {
    return this.menuItemService.findAll();
  }

  // ✅ Get all menu items under a specific restaurant (all menus)
  @Get('/restaurant/:restaurantId')
  @ApiOperation({ summary: 'Get all menu items for a specific restaurant' })
  @ApiParam({ name: 'restaurantId', description: 'UUID of the restaurant' })
  getMenuItemsByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.menuItemService.findByRestaurant(restaurantId);
  }
}
