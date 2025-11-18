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
  Query,
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

  // ✅ Create a menu item
  @Post()
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Add a menu item to a specific menu and restaurant',
    schema: {
      type: 'object',
      properties: {
        restaurantId: { type: 'string', example: 'uuid-of-restaurant' },
        menuId: { type: 'string', example: 'uuid-of-menu' },
        name: { type: 'string', example: 'Classic Pancakes' },
        price: { type: 'number', example: 7.99 },
        deliverySpeed: { type: 'string', example: '15 mins' },
        deliveryFee: { type: 'number', example: 0 },
        is_available: { type: 'string', example: 'active' },
        image: { type: 'string', format: 'binary' },
      },
      required: ['restaurantId', 'menuId', 'name', 'price'],
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  create(
    @Body() createMenuItemDto: CreateMenuItemDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const { restaurantId, menuId } = createMenuItemDto;
    return this.menuItemService.create(
      restaurantId,
      menuId,
      createMenuItemDto,
      image,
    );
  }

  // ✅ Fetch menu items using @Query()
  // Example: GET /menu-items?restaurantId=xx&menuId=yy
  @Get()
  @ApiOperation({
    summary:
      'Get all menu items or filter by restaurantId & menuId using query params',
  })
  getMenuItems(
    @Query('restaurantId') restaurantId?: string,
    @Query('menuId') menuId?: string,
  ) {
    if (restaurantId && menuId) {
      return this.menuItemService.findByMenu(restaurantId, menuId);
    }
    return this.menuItemService.findAll();
  }

  // ✅ Get a single menu item
  @Get(':itemId')
  @ApiOperation({ summary: 'Get a single menu item by its ID' })
  @ApiParam({ name: 'itemId', description: 'UUID of the menu item' })
  getItem(@Param('itemId') itemId: string) {
    return this.menuItemService.findOne(itemId);
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
        name: { type: 'string' },
        price: { type: 'number' },
        description: { type: 'string' },
        is_available: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  update(
    @Param('itemId') itemId: string,
    @Body() updateData: Partial<CreateMenuItemDto>,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.menuItemService.update(itemId, updateData, image);
  }

  // ✅ Delete a menu item
  @Delete(':itemId')
  @ApiOperation({ summary: 'Delete a menu item' })
  @ApiParam({ name: 'itemId', description: 'UUID of the menu item' })
  delete(@Param('itemId') itemId: string) {
    return this.menuItemService.delete(itemId);
  }

  // ✅ Get all items under a restaurant (all menus)
  @Get('/restaurant/:restaurantId')
  @ApiOperation({
    summary: 'Get all menu items for a specific restaurant (all menus)',
  })
  @ApiParam({ name: 'restaurantId', description: 'UUID of the restaurant' })
  getMenuItemsByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.menuItemService.findByRestaurant(restaurantId);
  }
}
