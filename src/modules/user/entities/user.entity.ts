import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Review } from '../../review/entities/review.entity';
import { Role } from '../constants/role.enum';
import { Field, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';

@Entity()
@ObjectType()
export class User extends CommonEntity {
  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  first_name?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  last_name?: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  phone?: string;

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.USER] })
  roles: Role[];

  @Column({ type: 'text' })
  @Exclude()
  password: string;

  @Column({ type: 'text', nullable: true })
  refresh_token?: string;

  @Column({ type: 'integer', default: 0 })
  cart_count: number;

  @OneToMany(() => Cart, (cart) => cart.user)
  cart_items: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
