import { SelectQueryBuilder } from 'typeorm';
import { Book } from '../entities/book.entity';
import { Maybe } from 'purify-ts/Maybe';
import { QueryBookDto } from '../dto/query-book.dto';

// generate auto 13 digit ISBN
export const generateISBN = () => {
  const isbn = Math.floor(
    1000000000000 + Math.random() * 9000000000000,
  ).toString();
  return isbn;
};

export const queryBuilder = (
  query: SelectQueryBuilder<Book>,
  req: QueryBookDto,
) => {
  Maybe.fromFalsy(req.keyword).ifJust((keyword) =>
    query.andWhere('book.keyword LIKE :keyword', {
      keyword: `%${keyword.toLowerCase()}%`,
    }),
  );

  Maybe.fromFalsy(req.status).ifJust((status) =>
    query.andWhere('book.status LIKE :status', {
      status: `%${status}%`,
    }),
  );

  if (req.categories?.length > 0) {
    query.leftJoinAndSelect('book.category', 'category');
    req.categories.forEach((category, index) => {
      const name = `category${index}`;
      query.orWhere(`category.name LIKE :${name}`, {
        [name]: `%${category}%`,
      });
    });
  }

  if (req.publishers) {
    req.publishers.forEach((publisher, index) => {
      const name = `publisher${index}`;
      query.orWhere(`book.publisher LIKE :${name}`, {
        [name]: `%${publisher}%`,
      });
    });
  }

  Maybe.fromFalsy(req.fromPrice).ifJust((fromPrice) =>
    query.andWhere('book.price >= :fromPrice', { fromPrice }),
  );

  Maybe.fromFalsy(req.toPrice).ifJust((toPrice) =>
    query.andWhere('book.price <= :toPrice', { toPrice }),
  );

  // Leftjoin review, group by book,
  // having round avg rating of each book
  // then filter by rating
  if (req.rating) {
    query
      .leftJoinAndSelect('book.reviews', 'review')
      .groupBy('book.id')
      .having('ROUND(AVG(review.rating)) = :rating', {
        rating: req.rating,
      })
      .select('book');
  }

  if (req.type) {
    const date = new Date();
    switch (req.type) {
      case 'popular':
        // order book by sold in this month
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        query
          .leftJoinAndSelect('book.order_details', 'order_detail')
          .groupBy('book.id')
          .orderBy('COALESCE(SUM(order_detail.quantity), 0)', 'DESC')
          .where('order_detail.created_at BETWEEN :firstDay AND :lastDay', {
            firstDay,
            lastDay,
          })
          .select('book');
        break;
      case 'sale':
        // order book by Sale price from the promotion book in current date
        query
          .leftJoinAndSelect('book.promotion_books', 'promotion')
          .leftJoinAndSelect('promotion.promotion', 'promotion_detail')
          .where('promotion_detail.type = :type', { type: 'SALE' })
          .groupBy('book.id')
          .having('COUNT(promotion) > 0')
          .andWhere('promotion_detail.from <= :date', { date })
          .andWhere('promotion_detail.to >= :date', { date })
          .orderBy('promotion.price', 'ASC')
          .select('book')
          .addSelect('MIN(promotion.price) as sale_price');
        break;
      case 'recommend':
        // order book by recommended
        query
          .leftJoinAndSelect('book.promotion_books', 'promotion')
          .leftJoinAndSelect('promotion.promotion', 'promotion_detail')
          .where('promotion_detail.type = :type', { type: 'RECOMMEND' })
          .groupBy('book.id')
          .having('COUNT(promotion) > 0')
          .andWhere('promotion_detail.from <= :date', { date })
          .andWhere('promotion_detail.to >= :date', { date })
          .select('book');
        break;
      default:
        break;
    }
  }

  // alway get non-deleted book
  query.andWhere('book.is_deleted = :is_deleted', { is_deleted: false });

  query.orderBy(`book.${req.sortBy}` || 'book.created_at', req.order || 'DESC');

  return query;
};
