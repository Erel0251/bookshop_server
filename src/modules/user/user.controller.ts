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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateCartDto } from '../cart/dto/create-cart.dto';
import { UpdateCartDto } from '../cart/dto/update-cart.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './constants/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('user')
@ApiTags('User')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(UserController.name);

  // Get all users
  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Res() res: any) {
    const users = await this.userService.findAll();
    res.status(HttpStatus.OK).render('user', { users, title: 'Users' });
  }

  // Get a single user
  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  // Update a user
  @Patch(':id')
  @Roles(Role.USER, Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // Delete a user
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }

  // Get user's cart list items
  @Get(':id/cart')
  @Roles(Role.USER, Role.ADMIN)
  async getCart(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const cart = await this.userService.getCart(id);
      const response = cart
        .filter((item) => item.book_id !== null)
        .map((item) => {
          return {
            book: {
              id: item.books_id,
              title: item.books_title,
              author: item.books_author,
              overview: item.books_overview,
              publisher: item.books_publisher,
              img_urls: item.books_img_urls,
              isbn: item.books_isbn,
              price: item.books_price,
              currency: item.books_currency,
              sale_price: item.sale_price,
            },
            quantity: item.cart_items_quantity,
          };
        });
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Add item to user's cart
  @Post(':id/cart')
  @Roles(Role.USER, Role.ADMIN)
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
  @Roles(Role.USER, Role.ADMIN)
  async updateCart(@Body() product: UpdateCartDto, @Res() res: any) {
    try {
      await this.userService.updateCartItem(product);
      return res.status(HttpStatus.OK).send({ message: 'Cart updated' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Clear user's cart after order
  @Delete(':id/cart')
  @Roles(Role.USER, Role.ADMIN)
  async clearCart(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      await this.userService.clearCart(id);
      return res.status(HttpStatus.OK).send({ message: 'Cart cleared' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Remove item from user's cart
  @Delete(':id/cart/:productId')
  @Roles(Role.USER, Role.ADMIN)
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
  @Roles(Role.USER, Role.ADMIN)
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
