import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateSupplementDetailDto } from './create-supplement-detail.dto';
import { IsUUID } from 'class-validator';

export class UpdateSupplementDeatailDto extends PartialType(
  CreateSupplementDetailDto,
) {
  @IsUUID()
  @ApiPropertyOptional()
  id?: string;
}
