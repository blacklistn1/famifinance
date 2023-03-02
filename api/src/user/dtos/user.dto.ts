import { Expose, Type } from 'class-transformer';

class UserProfileDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  @Type(() => UserProfileDto)
  profile: UserProfileDto;
}
