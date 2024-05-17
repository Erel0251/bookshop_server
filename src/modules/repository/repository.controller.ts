import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';

@Controller('repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Post()
  create(@Body() createRepositoryDto: CreateRepositoryDto) {
    //return this.repositoryService.create(createRepositoryDto);
    console.log(createRepositoryDto);
  }

  @Get()
  findAll() {
    return this.repositoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.repositoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRepositoryDto: UpdateRepositoryDto,
  ) {
    console.log(updateRepositoryDto);
    console.log(id);
    //return this.repositoryService.update(+id, updateRepositoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.repositoryService.remove(+id);
  }
}
