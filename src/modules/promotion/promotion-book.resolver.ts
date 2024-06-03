import { Float, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PromotionBook } from './entities/promotion-book.entity';

@Resolver(() => PromotionBook)
export class PromotionBookResolver {
  constructor() {}

  @ResolveField(() => String, { name: 'detail_id' })
  resolveId(@Parent() detail: PromotionBook): string {
    return detail.id;
  }

  @ResolveField(() => String, { name: 'id' })
  resolveBookId(@Parent() detail: PromotionBook): string {
    return detail.book.id;
  }

  @ResolveField(() => [String], { name: 'img_urls' })
  resolveBookImgUrls(@Parent() detail: PromotionBook): string[] {
    return detail.book.img_urls;
  }

  @ResolveField(() => String, { name: 'title' })
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

  @ResolveField(() => Float, { name: 'sale_price' })
  resolveSalePrice(@Parent() detail: PromotionBook): number {
    return detail.book.price * (1 - detail.discount / 100);
  }

  @ResolveField(() => String, { name: 'currency' })
  resolveCurrency(@Parent() detail: PromotionBook): string {
    return detail.book.currency;
  }
}
