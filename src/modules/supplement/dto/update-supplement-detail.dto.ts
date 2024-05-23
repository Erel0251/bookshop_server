import { PartialType } from '@nestjs/swagger';
import { CreateSupplementDetailDto } from './create-supplement-detail.dto';

export class UpdateSupplementDeatailDto extends PartialType(
  CreateSupplementDetailDto,
) {}
