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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(UserController.name);

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }

  // Get user's cart list items
  @Get(':id/cart')
  async getCart(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      // return await this.userService.getCart(id);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Add item to user's cart
  @Post(':id/cart')
  async addToCart(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() productId: string,
    @Res() res: any,
  ) {
    try {
      // return await this.userService.addToCart(id, productId);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Update item quantity in user's cart
  @Patch(':id/cart/:productId')
  async updateCart(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() quantity: number,
    @Res() res: any,
  ) {
    try {
      // return await this.userService.updateCart(id, productId, quantity);
      return res.status(HttpStatus.OK).send();
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
      // return await this.userService.removeFromCart(id, productId);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Get user's order list
  @Get(':id/order')
  async getOrder(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      // return await this.userService.getOrder(id);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }
}
