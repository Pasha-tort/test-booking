import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiBookingDto } from './dto';
import { BookingService } from './booking.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiResponse({ type: ApiBookingDto.createBooking.CreateBookingResponseDto })
  @Post()
  async createBooking(
    @Body() body: ApiBookingDto.createBooking.CreateBookingRequestDto,
  ) {
    return this.bookingService.createBooking(body);
  }

  @Get(':/bookingId')
  async getBooking(@Param('bookingId') bookingId: string) {
    return this.bookingService.getBookingById(bookingId);
  }
}
