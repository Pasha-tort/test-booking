import { Injectable } from '@nestjs/common';
import { RestaurantRepository } from './repositories';

@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async getAllRestaurants() {
    return this.restaurantRepository.getAllRestaurants();
  }
}
