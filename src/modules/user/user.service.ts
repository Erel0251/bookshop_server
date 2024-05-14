import { Injectable } from '@nestjs/common';
import { Equal, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: { email: Equal(email) },
    });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update({ email }, updateUserDto);
  }

  async remove(email: string) {
    return await this.userRepository.delete({ email });
  }
}
