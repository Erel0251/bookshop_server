import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Res,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateCartDto } from '../cart/dto/create-cart.dto';
import { UpdateCartDto } from '../cart/dto/update-cart.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(UserController.name);

  // Get all users
  @Get()
  async findAll(@Res() res: any) {
    const users = await this.userService.findAll();
    res.status(HttpStatus.OK).render('user', { users, title: 'Users' });
  }

  // Get a single user
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  // Update a user
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // Delete a user
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }

  // Get user's cart list items
  @Get(':id/cart')
  async getCart(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const cart = await this.userService.getCart(id);
      return res.status(HttpStatus.OK).send(cart);
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Add item to user's cart
  @Post(':id/cart')
  async addToCart(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() product: CreateCartDto,
    @Res() res: any,
  ) {
    try {
      await this.userService.addBookToCart(id, product);
      return res.status(HttpStatus.OK).send({ message: 'Item added to cart' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Update item quantity in user's cart
  @Post('/cart')
  async updateCart(@Body() product: UpdateCartDto, @Res() res: any) {
    try {
      await this.userService.updateCartItem(product);
      return res.status(HttpStatus.OK).send({ message: 'Cart updated' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Remove item from user's cart
  @Delete(':id/cart/:productId')
  async removeFromCart(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Res() res: any,
  ) {
    try {
      await this.userService.removeCartItem(id, productId);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Item removed from cart' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Get user's order list
  @Get(':id/order')
  async getOrder(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const orders = await this.userService.getOrder(id);
      return res.status(HttpStatus.OK).send(orders);
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }
}
