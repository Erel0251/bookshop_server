import { User } from 'src/modules/user/entities/user.entity';
import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CartDetail } from './cart-detail.entity';

@Entity({ name: 'cart' })
export class Cart extends CommonEntity {
  @Column({ type: 'real', default: 0 })
  total_price: number;

  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.carts)
  cart_details: CartDetail[];

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
