import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthorService } from './author.service';
//import { CreateAuthorDto } from './dto/create-author.dto';
//import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('author')
@ApiTags('Author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  create() {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(id);
  }
}
