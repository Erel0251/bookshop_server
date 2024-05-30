import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Promotion } from './entities/promotion.entity';
import { PromotionService } from './promotion.service';
import { PromotionBook } from './entities/promotion-book.entity';
import { PromotionType } from './constants/promotion-type.enum';

@Resolver(() => Promotion)
export class PromotionResolver {
  constructor(private promotionService: PromotionService) {}

  @Query(() => [Promotion])
  async promotions(): Promise<Promotion[]> {
    return await this.promotionService.findAll();
  }

  @Query(() => [Promotion], { name: 'promotionType' })
  async promotionType(
    @Args('type', { nullable: true })
    type: PromotionType,
  ): Promise<Promotion[]> {
    return await this.promotionService.findType(type);
  }

  @Query(() => Promotion, { name: 'promotion' })
  async promotion(@Parent() promotion: Promotion): Promise<Promotion> {
    return await this.promotionService.findOne(promotion.id);
  }

  @ResolveField(() => String, { name: 'id' })
  resolveId(promotion: Promotion): string {
    return promotion.id;
  }

  @ResolveField(() => [PromotionBook], { name: 'promotion_books' })
  async promotionBooks(
    @Parent() promotion: Promotion,
  ): Promise<PromotionBook[]> {
    return await this.promotionService.findDetailPromotion(promotion.id);
  }
}
