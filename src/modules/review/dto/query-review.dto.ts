import { IsNumber, IsOptional, IsUUID } from 'class-validator';
import { CommonDto } from '../../../shared/dto/common.dto';

export class QueryReviewDto extends CommonDto {
  @IsUUID()
  id: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  constructor(partial: Partial<QueryReviewDto>) {
    super();
    Object.assign(this, partial);
  }
}
