import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Res,
  HttpStatus,
  Get,
  Delete,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import { SupplementService } from './supplement.service';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Supplement')
@Controller('supplement')
export class SupplementController {
  constructor(private readonly supplementService: SupplementService) {}

  private readonly logger = new Logger(SupplementController.name);

  @Post()
  async asynccreate(
    @Body() createSupplementDto: CreateSupplementDto,
    @Res() res: any,
  ) {
    try {
      await this.supplementService.create(createSupplementDto);
      return res.status(HttpStatus.CREATED).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  @Get()
  async findAll(@Res() res: any) {
    try {
      const supplements = await this.supplementService.findAll();
      return res.status(HttpStatus.OK).send(supplements);
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const supplement = await this.supplementService.findOne(id);
      return res.status(HttpStatus.OK).send(supplement);
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSupplementDto: UpdateSupplementDto,
    @Res() res: any,
  ) {
    try {
      await this.supplementService.update(id, updateSupplementDto);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      await this.supplementService.remove(id);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }
}
