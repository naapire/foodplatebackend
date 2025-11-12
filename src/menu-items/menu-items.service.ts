import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from 'src/entities/menu-item.entity';
import { Menu } from 'src/entities/menu.entity';
import { Restaurant } from 'src/entities/restaurant.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepo: Repository<MenuItem>,

    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,

    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,

    private readonly cloudinaryService: CloudinaryService, // added CloudinaryService
  ) {}

  // ✅ Create a new menu item
  async create(
    restaurantId: string,
    menuId: string,
    data: any,
    file?: Express.Multer.File,
  ) {
    const { name, deliverySpeed, deliveryFee, price } = data;

    if (!name || !deliverySpeed || !deliveryFee || !price) {
      throw new BadRequestException('Missing required fields.');
    }

    const restaurant = await this.restaurantRepo.findOne({ where: { id: restaurantId } });
    const menu = await this.menuRepo.findOne({ where: { id: menuId } });

    if (!restaurant || !menu) throw new NotFoundException('Menu or Restaurant not found.');

    let imageUrl: string | null = null;
    if (file) {
      const uploadRes = await this.cloudinaryService.upload(file.buffer, { folder: 'menu' });
      imageUrl = uploadRes.secure_url;
    }

    const newItem = this.menuItemRepo.create({
  name,
  deliverySpeed,
  deliveryFee: parseFloat(deliveryFee),
  price: parseFloat(price),
  image: imageUrl ?? undefined, // <-- use undefined instead of null
  restaurant,
  menu,
});


    return await this.menuItemRepo.save(newItem);
  }

  // ✅ Get all menu items (all restaurants + menus)
  async findAll() {
    return this.menuItemRepo.find({
      relations: ['menu', 'restaurant'],
      order: { id: 'DESC' },
    });
  }

  // ✅ Get all items for a specific menu
  async findByMenu(restaurantId: string, menuId: string) {
    return this.menuItemRepo.find({
      where: {
        restaurant: { id: restaurantId },
        menu: { id: menuId },
      },
      relations: ['menu', 'restaurant'],
    });
  }

  // ✅ Get a single item
  async findOne(restaurantId: string, menuId: string, itemId: string) {
    const item = await this.menuItemRepo.findOne({
      where: {
        id: itemId,
        restaurant: { id: restaurantId },
        menu: { id: menuId },
      },
      relations: ['menu', 'restaurant'],
    });

    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  // ✅ Update a menu item
  async update(
    restaurantId: string,
    menuId: string,
    itemId: string,
    data: any,
    file?: Express.Multer.File,
  ) {
    const item = await this.menuItemRepo.findOne({
      where: {
        id: itemId,
        restaurant: { id: restaurantId },
        menu: { id: menuId },
      },
    });

    if (!item) throw new NotFoundException('Menu item not found.');

    let imageUrl: string | null = item.image;
    if (file) {
      const uploadRes = await this.cloudinaryService.upload(file.buffer, { folder: 'menu' });
      imageUrl = uploadRes.secure_url;
    }

    Object.assign(item, {
      name: data.name ?? item.name,
      deliverySpeed: data.deliverySpeed ?? item.deliverySpeed,
      deliveryFee: data.deliveryFee ? parseFloat(data.deliveryFee) : item.deliveryFee,
      price: data.price ? parseFloat(data.price) : item.price,
      image: imageUrl,
    });

    return await this.menuItemRepo.save(item);
  }

  // ✅ Delete a menu item
  async delete(restaurantId: string, menuId: string, itemId: string) {
    const result = await this.menuItemRepo.delete({
      id: itemId,
      restaurant: { id: restaurantId },
      menu: { id: menuId },
    });

    if (result.affected === 0) throw new NotFoundException('Menu item not found.');
    return { message: 'Menu item deleted successfully' };
  }

  // ✅ Get all items by restaurant (across all menus)
  async findByRestaurant(restaurantId: string) {
    return this.menuItemRepo.find({
      where: { restaurant: { id: restaurantId } },
      relations: ['menu', 'restaurant'],
      order: { id: 'DESC' },
    });
  }
}
