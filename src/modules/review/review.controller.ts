import {
  Controller,
  Param,
  Delete,
  ParseUUIDPipe,
  Res,
  HttpStatus,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/constants/role.enum';

@Controller('review')
@ApiTags('Review')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Create a new review
  @Post()
  @Roles(Role.USER)
  async create(@Body() createReview: CreateReviewDto, @Res() res: any) {
    await this.reviewService.create(createReview);
    res
      .status(HttpStatus.CREATED)
      .send({ message: 'Review created successfully' });
  }

  // Update a review
  @Post(':id')
  @Roles(Role.USER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReview: CreateReviewDto,
    @Res() res: any,
  ) {
    await this.reviewService.update(id, updateReview);
    res.status(HttpStatus.OK).send({ message: 'Review updated successfully' });
  }

  @Delete(':id')
  @Roles(Role.USER)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    await this.reviewService.remove(id);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Review deleted successfully' });
  }
}
