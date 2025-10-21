import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
       private readonly cloudinaryService: CloudinaryService,
  ) {}

 async create(dto: CreateMenuDto, imageBuffer?: Buffer): Promise<Menu> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id: dto.restaurantId } });
    if (!restaurant) throw new BadRequestException('Restaurant not found');

    let image_url = dto.image_url;

    if (imageBuffer) {
      const uploadRes = await this.cloudinaryService.upload(imageBuffer, { folder: 'menus' });
      image_url = uploadRes.secure_url;
    }

    const payload: DeepPartial<Menu> = {
      name: dto.name,
      promotionDetails: dto.promotionDetails,
      is_available: dto.is_available ?? 'active',
      image_url,
      restaurant,
    };

    const menu = this.menuRepo.create(payload);
    return this.menuRepo.save(menu);
  }

  async findAll() {
    return this.menuRepo.find();
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuRepo.findOne({
      where: { id },
      relations: ['restaurant', 'items'],
    });
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }

  async update(id: string, updateDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.menuRepo.findOne({ where: { id }, relations: ['restaurant'] });
    if (!menu) throw new NotFoundException('Menu not found');

    if (updateDto.restaurantId) {
      const restaurant = await this.restaurantRepo.findOne({ where: { id: updateDto.restaurantId } });
      if (!restaurant) throw new BadRequestException('Restaurant not found');
      menu.restaurant = restaurant;
    }

    if (typeof updateDto.name !== 'undefined') menu.name = updateDto.name;
    if (typeof updateDto.promotionDetails !== 'undefined') menu.promotionDetails = updateDto.promotionDetails;
    if (typeof updateDto.is_available !== 'undefined') menu.is_available = updateDto.is_available;
    if (typeof updateDto.image_url !== 'undefined') menu.image_url = updateDto.image_url;

    return this.menuRepo.save(menu);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.menuRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Menu not found');
    return { deleted: true };
  }
}
