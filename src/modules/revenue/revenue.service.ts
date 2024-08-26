import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';
import { Not, Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { OrderDetail } from '../order/entities/order-detail.entity';
import { Supplement } from '../supplement/entities/supplement.entity';
import { SupplementDetail } from '../supplement/entities/supplement-detail.entity';
import { OrderStatus } from '../order/constants/order-status.enum';
import { Role } from '../user/constants/role.enum';
import { Category } from '../category/entities/category.entity';
import { RevenueDto } from './dto/revenue.dto';
import { GraphData } from './dto/graph.dto';

@Injectable()
export class RevenueService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,

    @InjectRepository(Supplement)
    private readonly supplementRepository: Repository<Supplement>,

    @InjectRepository(SupplementDetail)
    private readonly supplementDetailRepository: Repository<SupplementDetail>,
  ) {}

  async getRegisteredUserCount(): Promise<{
    registered: number;
    account_admin: number;
    account_user: number;
  }> {
    const accounts = await this.userRepository.find();
    const registered = accounts.length;
    const account_admin = accounts.filter((account) =>
      account.roles.includes(Role.ADMIN),
    ).length;
    return {
      registered,
      account_admin,
      account_user: registered - account_admin,
    };
  }

  async getOrderedCount(): Promise<number> {
    // if order status is not cancelled then count
    return this.orderRepository.count({
      where: { status: Not(OrderStatus.CANCELLED) },
    });
  }

  async getBookCount(): Promise<number> {
    return this.bookRepository.count();
  }

  async getCategoryCount(): Promise<{
    total: number;
    published: number;
    unpublished: number;
  }> {
    const categories = await this.categoryRepository.find();
    const publishedCategories = categories.filter(
      (category) => category.is_published,
    );
    return {
      total: categories.length,
      published: publishedCategories.length,
      unpublished: categories.length - publishedCategories.length,
    };
  }

  async getOrderedBookCount(): Promise<number> {
    // if order status is not cancelled then count
    const orders = await this.orderRepository.find({
      relations: ['order_details'],
    });
    return orders
      .filter((order) => order.status !== OrderStatus.CANCELLED)
      .reduce(
        (total, order) =>
          total +
          order.order_details.reduce(
            (subTotal, orderDetail) => subTotal + orderDetail.quantity,
            0,
          ),
        0,
      );
  }

  async getTotalExpense(): Promise<number> {
    const supplements = await this.supplementRepository.find({
      relations: ['supplement_details'],
    });
    return supplements.reduce((total, supplement) => {
      return (
        total +
        supplement.supplement_details.reduce(
          (subTotal, supplementDetail) =>
            subTotal + supplementDetail.price * supplementDetail.quantity,
          0,
        )
      );
    }, 0);
  }

  async getTotalIncome(): Promise<number> {
    const orders = await this.orderRepository.find({
      relations: ['order_details'],
    });
    return orders
      .filter((order) => order.status === OrderStatus.CONFIRMED)
      .reduce((total, order) => {
        return (
          total +
          order.order_details.reduce(
            (subTotal, orderDetail) => subTotal + orderDetail.total_price,
            0,
          )
        );
      }, 0);
  }

  async getExpenseEachMonth(): Promise<number[]> {
    const supplements = await this.supplementRepository.find({
      relations: ['supplement_details'],
    });
    const expenses = Array(12).fill(0);
    supplements.forEach((supplement) => {
      supplement.supplement_details.forEach((supplementDetail) => {
        const month = new Date(supplement.date).getMonth();
        expenses[month] += supplementDetail.price * supplementDetail.quantity;
      });
    });
    return expenses;
  }

  async getIncomeEachMonth(): Promise<number[]> {
    const orders = (
      await this.orderRepository.find({
        relations: ['order_details'],
      })
    ).filter((order) => order.status === OrderStatus.CONFIRMED);
    const incomes = Array(12).fill(0);
    orders.forEach((order) => {
      if (order.status === OrderStatus.CANCELLED) {
        return;
      }
      order.order_details.forEach((orderDetail) => {
        const month = new Date(order.updated_at).getMonth();
        incomes[month] += orderDetail.total_price;
      });
    });
    return incomes;
  }

  async getRevenue(): Promise<RevenueDto> {
    const { registered, account_admin, account_user } =
      await this.getRegisteredUserCount();
    const book = await this.getBookCount();
    const category = await this.getCategoryCount();
    const order = await this.getOrderedCount();
    const expense = await this.getTotalExpense();
    const income = await this.getTotalIncome();
    return {
      registered,
      account_admin,
      account_user,
      book,
      category,
      order,
      expense,
      income,
    };
  }

  async getGraphData() {
    const expenses = await this.getExpenseEachMonth();
    const incomes = await this.getIncomeEachMonth();
    const data = new GraphData(expenses, incomes);
    return data;
  }
}
