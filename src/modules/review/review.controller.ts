import {
  Controller,
  Param,
  Delete,
  ParseUUIDPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    await this.reviewService.remove(id);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Review deleted successfully' });
  }
}
