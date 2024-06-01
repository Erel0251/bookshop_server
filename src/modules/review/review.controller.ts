import {
  Controller,
  Param,
  Delete,
  ParseUUIDPipe,
  Res,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('review')
@ApiTags('Review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Create a new review
  @Post()
  async create(createReview: CreateReviewDto, @Res() res: any) {
    await this.reviewService.create(createReview);
    res
      .status(HttpStatus.CREATED)
      .send({ message: 'Review created successfully' });
  }

  // Update a review
  @Post(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    updateReview: CreateReviewDto,
    @Res() res: any,
  ) {
    await this.reviewService.update(id, updateReview);
    res.status(HttpStatus.OK).send({ message: 'Review updated successfully' });
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    await this.reviewService.remove(id);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Review deleted successfully' });
  }
}
