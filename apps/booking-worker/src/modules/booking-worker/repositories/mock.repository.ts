import { RestaurantEntity, TableEntity } from '@libs/database';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MockRepository implements OnModuleInit {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @InjectRepository(TableEntity)
    private readonly tableRepository: Repository<TableEntity>,
  ) {}

  async onModuleInit() {
    await this.createRestaurants();
  }

  async createRestaurants() {
    const restaurantIds = [
      'f825351f-bacd-4ef3-a076-ffe4e995a7d3',
      '64682e3b-4fc3-407c-baa5-3b2deb82ddaa',
      'a9d172e8-5152-4beb-815e-a4aec08ede86',
      '1d9904f3-db5c-484d-8388-46a6c94ab104',
      '6d8b76b1-c2a4-49cf-980b-20e7fbf713ba',
      '82a0ac48-dd3a-4076-9eda-7f68d4168c49',
    ];
    const restaurants = await this.restaurantRepository.find();
    const existsRestaurantIds = restaurants.map(r => r.id);
    const restaurantIdsNecessaryToCreate = restaurantIds.filter(
      id => !existsRestaurantIds.includes(id),
    );
    await Promise.all(
      restaurantIdsNecessaryToCreate.map(async id =>
        this.restaurantRepository.save(
          this.restaurantRepository.create({
            id: id,
            tables: [
              this.tableRepository.create({
                numberSeats: 2,
                sequenceNumber: 1,
              }),
              this.tableRepository.create({
                numberSeats: 2,
                sequenceNumber: 2,
              }),
              this.tableRepository.create({
                numberSeats: 2,
                sequenceNumber: 3,
              }),
              this.tableRepository.create({
                numberSeats: 2,
                sequenceNumber: 4,
              }),
              this.tableRepository.create({
                numberSeats: 2,
                sequenceNumber: 5,
              }),
              this.tableRepository.create({
                numberSeats: 2,
                sequenceNumber: 6,
              }),
              this.tableRepository.create({
                numberSeats: 4,
                sequenceNumber: 7,
              }),
              this.tableRepository.create({
                numberSeats: 4,
                sequenceNumber: 8,
              }),
              this.tableRepository.create({
                numberSeats: 4,
                sequenceNumber: 9,
              }),
              this.tableRepository.create({
                numberSeats: 4,
                sequenceNumber: 10,
              }),
              this.tableRepository.create({
                numberSeats: 6,
                sequenceNumber: 11,
              }),
              this.tableRepository.create({
                numberSeats: 6,
                sequenceNumber: 12,
              }),
            ],
          }),
        ),
      ),
    );
  }
}
