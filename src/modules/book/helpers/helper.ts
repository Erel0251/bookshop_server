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

  Maybe.fromFalsy(req.category).ifJust((category) =>
    query
      .leftJoinAndSelect('book.category', 'category')
      .andWhere('category.name LIKE :category', {
        category: `%${category}%`,
      }),
  );

  Maybe.fromFalsy(req.fromPrice).ifJust((fromPrice) =>
    query.andWhere('book.price >= :fromPrice', { fromPrice }),
  );

  Maybe.fromFalsy(req.toPrice).ifJust((toPrice) =>
    query.andWhere('book.price <= :toPrice', { toPrice }),
  );

  // Leftjoin review then get average rating
  if (req.rating) {
    query
      .leftJoinAndSelect('book.reviews', 'review')
      .addSelect('AVG(review.rating)', 'avg_rating')
      .groupBy('book.id')
      .having('AVG(review.rating) >= :rating', { rating: req.rating });
  }

  // alway get non-deleted book
  query.andWhere('book.is_deleted = :is_deleted', { is_deleted: false });

  query.orderBy(req.sortBy || 'book.created_at', req.order || 'DESC');

  return query;
};
