import { BookingStatusEnum } from '@libs/shared';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsUUID } from 'class-validator';

export namespace ApiBookingDto {
  export namespace createBooking {
    export class CreateBookingRequestDto {
      @ApiProperty()
      @IsUUID('4')
      restaurantId: string;

      @ApiProperty({ type: Number })
      @IsInt()
      guestCount: number;

      @ApiProperty({ type: Date })
      @Type(() => Date)
      @IsDate()
      date: Date;
    }
    export class CreateBookingResponseDto {
      @ApiProperty()
      bookingId: string;
    }
  }

  export namespace getBookingById {
    export class GetBookingByIdResponseDto {
      @ApiProperty()
      bookingId: string;

      @ApiProperty()
      restaurantId: string;

      @ApiProperty({ type: Number })
      guestCount: number;

      @ApiProperty({ type: Number })
      sequenceNumber: number;

      @ApiProperty({ type: Date })
      @Type(() => Date)
      date: Date;

      @ApiProperty({ enum: BookingStatusEnum })
      status: BookingStatusEnum;
    }
  }
}
