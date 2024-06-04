import { ResolveField, Resolver } from '@nestjs/graphql';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private reviewService: ReviewService) {}

  @ResolveField(() => String, { name: 'id' })
  resolveId(review: Review): string {
    return review.id;
  }

  @ResolveField(() => String, { name: 'created_at' })
  resolveDate(review: Review): string {
    return review.created_at.toISOString();
  }
}
