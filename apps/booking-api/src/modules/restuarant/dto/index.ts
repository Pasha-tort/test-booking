import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export namespace ApiRestaurant {
  export namespace getRestaurants {
    class Restaurant {
      @ApiProperty()
      id: string;
    }
    export class GetRestaurantsResponseDto {
      @ApiProperty({ type: [Restaurant] })
      @Type(() => Restaurant)
      restaurants: Restaurant[];
    }
  }
}
