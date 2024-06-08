import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { SupplementDetail } from './supplement-detail.entity';

@Entity()
export class Supplement extends CommonEntity {
  @Column()
  name: string;

  @Column()
  description?: string;

  @Column({ default: 0 })
  total_quantity: number;

  @Column({ type: 'real', default: 0 })
  total_price: number;

  @Column({ default: 'VND' })
  currency: string;

  @Column()
  supplier: string;

  @Column({ nullable: true })
  date: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @OneToMany(
    () => SupplementDetail,
    (supplementDetail) => supplementDetail.supplements,
  )
  supplement_details?: SupplementDetail[];
}
