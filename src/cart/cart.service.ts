import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/entities/cart.entity';
import { MenuItem } from 'src/entities/menu-item.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // ================================
  // ADD TO CART
  // ================================
  async addToCart(
    userId: string,
    menuItemId: string,
    quantity: number,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const menuItem = await this.menuItemRepo.findOne({ where: { id: menuItemId } });

    if (!user) throw new NotFoundException('User not found');
    if (!menuItem) throw new NotFoundException('Menu item not found');

    // Price should always come from MenuItem
    const price = menuItem.price;

    const cartItem = this.cartRepo.create({
      user,
      menuItem,
      quantity,
      price,
      status: 'active',
    });

    return this.cartRepo.save(cartItem);
  }

  // ================================
  // GET USER CART
  // ================================
  async getCart(userId: string) {
    return this.cartRepo.find({
      where: {
        user: { id: userId },
        status: 'active',
      },
      relations: ['menuItem', 'user'],
    });
  }

  // ================================
  // UPDATE CART ITEM
  // ================================
  async updateCartItem(
    cartId: string,
    userId: string,
    quantity?: number,
    status?: 'active' | 'checked_out',
  ) {
    const cartItem = await this.cartRepo.findOne({
      where: { id: cartId, user: { id: userId } },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    if (quantity !== undefined) cartItem.quantity = quantity;
    if (status !== undefined) cartItem.status = status;

    return this.cartRepo.save(cartItem);
  }

  // ================================
  // DELETE CART ITEM
  // ================================
  async deleteCartItem(cartId: string, userId: string) {
    const result = await this.cartRepo.delete({
      id: cartId,
      user: { id: userId },
    });

    if (!result.affected) {
      throw new NotFoundException('Cart item not found');
    }

    return { message: 'Item removed successfully' };
  }

  // ================================
  // CHECKOUT
  // ================================
  async checkout(userId: string) {
    const cartItems = await this.cartRepo.find({
      where: { user: { id: userId }, status: 'active' },
    });

    if (cartItems.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    // Calculate total
    const total = cartItems.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.quantity),
      0,
    );

    // Mark all items as checked out
    await this.cartRepo.update(
      { user: { id: userId }, status: 'active' },
      { status: 'checked_out' },
    );

    return {
      message: 'Checkout successful',
      total,
    };
  }
}
