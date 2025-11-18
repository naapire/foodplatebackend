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

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // =============================
  // CREATE MENU ITEM
  // =============================
  async create(
    restaurantId: string,
    menuId: string,
    data: any,
    file?: Express.Multer.File,
  ) {
    const { name, price, deliverySpeed, deliveryFee, is_available } = data;

    if (!name || price === undefined || price === null) {
      throw new BadRequestException('Missing required fields: name or price.');
    }

    const restaurant = await this.restaurantRepo.findOne({ where: { id: restaurantId } });
    const menu = await this.menuRepo.findOne({ where: { id: menuId } });

    if (!restaurant || !menu) throw new NotFoundException('Menu or Restaurant not found.');

    let imageUrl: string | undefined;
    if (file) {
      const uploadRes = await this.cloudinaryService.upload(file.buffer, {
        folder: 'menu',
      });
      imageUrl = uploadRes.secure_url;
    }

    const newItem = this.menuItemRepo.create({
      name,
      price: parseFloat(price),
      deliverySpeed: deliverySpeed ?? undefined,
      deliveryFee: deliveryFee !== undefined ? parseFloat(deliveryFee) : 0.0,
      is_available: is_available ?? 'active',
      image: imageUrl,
      restaurant,
      menu,
    });

    return await this.menuItemRepo.save(newItem);
  }

  // =============================
  // GET ALL MENU ITEMS (GLOBAL)
  // =============================
  async findAll() {
    return this.menuItemRepo.find({
      relations: ['menu', 'restaurant'],
      order: { id: 'DESC' },
    });
  }

  // =============================
  // GET ITEMS FROM MENU
  // =============================
  async findByMenu(restaurantId: string, menuId: string) {
    return this.menuItemRepo.find({
      where: {
        restaurant: { id: restaurantId },
        menu: { id: menuId },
      },
      relations: ['menu', 'restaurant'],
    });
  }

  // =============================
  // GET SINGLE ITEM BY ID ONLY
  // =============================
  async findOne(itemId: string) {
    const item = await this.menuItemRepo.findOne({
      where: { id: itemId },
      relations: ['menu', 'restaurant'],
    });

    if (!item) throw new NotFoundException('Menu item not found.');
    return item;
  }

  // =============================
  // UPDATE MENU ITEM (BY ID)
  // =============================
  async update(
    itemId: string,
    data: any,
    file?: Express.Multer.File,
  ) {
    const item = await this.menuItemRepo.findOne({ where: { id: itemId } });

    if (!item) throw new NotFoundException('Menu item not found.');

    let imageUrl: string | null = item.image;
    if (file) {
      const uploadRes = await this.cloudinaryService.upload(file.buffer, {
        folder: 'menu',
      });
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

  // =============================
  // DELETE MENU ITEM (BY ID)
  // =============================
  async delete(itemId: string) {
    const result = await this.menuItemRepo.delete({ id: itemId });

    if (result.affected === 0) {
      throw new NotFoundException('Menu item not found.');
    }

    return { message: 'Menu item deleted successfully' };
  }

  // =============================
  // GET ALL ITEMS BY RESTAURANT
  // =============================
  async findByRestaurant(restaurantId: string) {
    return this.menuItemRepo.find({
      where: { restaurant: { id: restaurantId } },
      relations: ['menu', 'restaurant'],
      order: { id: 'DESC' },
    });
  }
}
