import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplement } from './entities/supplement.entity';
import { Repository } from 'typeorm';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';

@Injectable()
export class SupplementService {
  constructor(
    @InjectRepository(Supplement)
    private supplementRepository: Repository<Supplement>,
  ) {}

  async create(createSupplementDto: CreateSupplementDto) {
    const supplement = this.supplementRepository.create(createSupplementDto);
    return this.supplementRepository.save(supplement);
  }

  async update(id: string, updateSupplementDto: UpdateSupplementDto) {
    const supplement = await this.supplementRepository.findOne({
      where: { id },
    });
    if (!supplement) {
      throw new Error('Supplement not found');
    }
    this.supplementRepository.merge(supplement, updateSupplementDto);
    return this.supplementRepository.save(supplement);
  }
}
