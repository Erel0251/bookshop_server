import {
  Field,
  Float,
  Int,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Review } from './entities/review.entity';

@ObjectType()
export class ReviewResponse {
  @Field(() => Int)
  total: number;

  @Field(() => Float)
  average: number;

  @Field(() => [Int])
  details: number[];

  @Field(() => [Review])
  data: Review[];
}

@Resolver(() => Review)
export class ReviewResolver {
  constructor() {}

  @ResolveField(() => String, { name: 'id' })
  resolveId(review: Review): string {
    return review.id;
  }

  @ResolveField(() => String, { name: 'created_at' })
  resolveDate(review: Review): string {
    return review.created_at.toISOString();
  }
}
