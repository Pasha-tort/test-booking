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
      bookingId: string;
    }
  }
}
