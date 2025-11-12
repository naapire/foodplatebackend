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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MenuItemService } from './menu-items.service';

@Controller('restaurants/:restaurantId/menus/:menuId/menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Body() data: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.menuItemService.create(restaurantId, menuId, data, file);
  }

  @Get()
  getMenuItems(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
  ) {
    return this.menuItemService.findByMenu(restaurantId, menuId);
  }

  @Get(':itemId')
  getItem(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.menuItemService.findOne(restaurantId, menuId, itemId);
  }

  @Patch(':itemId')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Param('itemId') itemId: string,
    @Body() data: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.menuItemService.update(restaurantId, menuId, itemId, data, file);
  }

  @Delete(':itemId')
  delete(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.menuItemService.delete(restaurantId, menuId, itemId);
  }
}
