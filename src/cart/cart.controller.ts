import { Controller, Post, Get, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  // Add to cart
  @Post()
  addToCart(@Req() req, @Body() body: CreateCartDto) {
    return this.cartService.addToCart(
      req.user.id,
      body.menuItemId,
      body.quantity,
    );
  }

  // Get user cart
  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  // Update a cart item
  @Put(':id')
  updateItem(
    @Req() req,
    @Param('id') id: string,
    @Body() body: UpdateCartDto,
  ) {
    return this.cartService.updateCartItem(
      id,
      req.user.id,
      body.quantity,
      body.status,
    );
  }

  // Delete a cart item
  @Delete(':id')
  deleteItem(@Req() req, @Param('id') id: string) {
    return this.cartService.deleteCartItem(id, req.user.id);
  }

  // Checkout
  @Post('checkout')
  checkout(@Req() req) {
    return this.cartService.checkout(req.user.id);
  }
}
