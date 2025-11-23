import { RestaurantEntity } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly repository: Repository<RestaurantEntity>,
  ) {}

  async getAllRestaurants() {
    return this.repository.find();
  }
}
