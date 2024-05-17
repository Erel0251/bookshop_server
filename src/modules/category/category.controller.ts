import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor() {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    //return this.categoryService.create(createCategoryDto);
    console.log('createCategoryDto', createCategoryDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    //return this.categoryService.update(+id, updateCategoryDto);
    console.log('updateCategoryDto', updateCategoryDto);
    console.log('id', id);
  }
}
