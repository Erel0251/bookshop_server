import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderDetail } from './order-detail.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { CommonEntity } from 'src/shared/entites/common.entity';
import { OrderStatus } from '../constants/order-status.enum';

@Entity()
export class Order extends CommonEntity {
  @Column()
  name: string;

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

  @Column({ default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'real' })
  total_price: number;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.orders)
  order_details: OrderDetail[];

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
