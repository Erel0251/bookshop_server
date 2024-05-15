import { Injectable } from '@nestjs/common';
// import { CreateRepositoryDto } from './dto/create-repository.dto';
// import { UpdateRepositoryDto } from './dto/update-repository.dto';

@Injectable()
export class RepositoryService {
  create() {
    return 'This action adds a new repository';
  }

  findAll() {
    return `This action returns all repository`;
  }

  findOne(id: number) {
    return `This action returns a #${id} repository`;
  }

  update(id: number) {
    return `This action updates a #${id} repository`;
  }

  remove(id: number) {
    return `This action removes a #${id} repository`;
  }
}
