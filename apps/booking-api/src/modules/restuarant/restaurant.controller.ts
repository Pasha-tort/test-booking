import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiRestaurant } from './dto';
import { RestaurantService } from './restaurant.service';
import { plainToInstance } from 'class-transformer';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiResponse({ type: ApiRestaurant.getRestaurants.GetRestaurantsResponseDto })
  @Get('restaurants')
  async getRestaurants() {
    const restaurants = await this.restaurantService.getAllRestaurants();
    return plainToInstance(
      ApiRestaurant.getRestaurants.GetRestaurantsResponseDto,
      { restaurants },
    );
  }
}
