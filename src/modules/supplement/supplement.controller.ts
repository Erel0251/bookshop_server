import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { SupplementService } from './supplement.service';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Supplement')
@Controller('supplement')
export class SupplementController {
  constructor(private readonly supplementService: SupplementService) {}

  @Post()
  async asynccreate(
    @Body() createSupplementDto: CreateSupplementDto,
    @Res() res: any,
  ) {
    try {
      await this.supplementService.create(createSupplementDto);
      return res.status(HttpStatus.CREATED).send();
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupplementDto: UpdateSupplementDto,
    @Res() res: any,
  ) {
    try {
      await this.supplementService.update(id, updateSupplementDto);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }
}
