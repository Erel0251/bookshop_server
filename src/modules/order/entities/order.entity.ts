import { OrderDetail } from './order-detail.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Order extends CommonEntity {
  @Column()
  province: string;

  @Column()
  district: string;

  @Column()
  ward: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ type: 'real' })
  total_price: number;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.orders)
  order_details: OrderDetail[];

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
