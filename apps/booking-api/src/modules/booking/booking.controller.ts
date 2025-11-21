import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiBookingDto } from './dto';
import { BookingService } from './booking.service';
import { plainToInstance } from 'class-transformer';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiResponse({ type: ApiBookingDto.createBooking.CreateBookingResponseDto })
  @Post()
  async createBooking(
    @Body() body: ApiBookingDto.createBooking.CreateBookingRequestDto,
  ) {
    const booking = await this.bookingService.createBooking(body);
    return plainToInstance(
      ApiBookingDto.createBooking.CreateBookingResponseDto,
      booking,
    );
  }

  @ApiResponse({ type: ApiBookingDto.getBookingById.GetBookingByIdResponseDto })
  @Get(':/bookingId')
  async getBooking(@Param('bookingId') bookingId: string) {
    const booking = await this.bookingService.getBookingById(bookingId);
    return plainToInstance(
      ApiBookingDto.getBookingById.GetBookingByIdResponseDto,
      booking,
    );
  }
}
