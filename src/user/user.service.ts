import { Injectable } from '@nestjs/common';
import { ProfileDto } from './dto';

@Injectable()
export class UserService {
  profile(dto: ProfileDto) {
    return dto;
  }
}
