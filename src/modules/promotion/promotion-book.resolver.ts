import { Float, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PromotionBook } from './entities/promotion-book.entity';

@Resolver(() => PromotionBook)
export class PromotionBookResolver {
  constructor() {}

  @ResolveField(() => String, { name: 'id' })
  resolveId(@Parent() detail: PromotionBook): string {
    return detail.id;
  }

  @ResolveField(() => String, { name: 'book_id' })
  resolveBookId(@Parent() detail: PromotionBook): string {
    return detail.book.id;
  }

  @ResolveField(() => String, { name: 'name' })
  resolveBookName(@Parent() detail: PromotionBook): string {
    return detail.book.title;
  }

  @ResolveField(() => String, { name: 'author', nullable: true })
  resolveBookAuthor(@Parent() detail: PromotionBook): string {
    return detail.book.author;
  }

  @ResolveField(() => String, { name: 'publisher', nullable: true })
  resolveBookPublisher(@Parent() detail: PromotionBook): string {
    return detail.book.publisher;
  }

  @ResolveField(() => Float, { name: 'price' })
  resolveBookPrice(@Parent() detail: PromotionBook): number {
    return detail.book.price;
  }
}
