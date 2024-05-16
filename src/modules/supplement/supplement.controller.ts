import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SupplementService } from './supplement.service';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';

@Controller('supplement')
export class SupplementController {
  constructor(private readonly supplementService: SupplementService) {}

  @Post()
  create(@Body() createSupplementDto: CreateSupplementDto) {
    return this.supplementService.create(createSupplementDto);
  }

  @Get()
  findAll() {
    return this.supplementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplementService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplementDto: UpdateSupplementDto,
  ) {
    return this.supplementService.update(+id, updateSupplementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplementService.remove(+id);
  }
}
