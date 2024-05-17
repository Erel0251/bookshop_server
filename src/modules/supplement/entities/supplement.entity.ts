import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { SupplementDetail } from './supplement-detail.entity';

@Entity()
export class Supplement extends CommonEntity {
  @Column()
  name: string;

  @Column()
  description?: string;

  @Column()
  total_quantity: number;

  @Column()
  total_price: number;

  @Column()
  currency: string;

  @Column({ nullable: true })
  supplier?: string;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @OneToMany(
    () => SupplementDetail,
    (supplementDetail) => supplementDetail.supplements,
  )
  supplement_details: SupplementDetail[];
}
