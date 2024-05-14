import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'author' })
export class Author extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  bio: string;
}
