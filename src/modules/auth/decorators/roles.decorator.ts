import { SetMetadata } from '@nestjs/common';
import { Role } from '../../user/constants/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
