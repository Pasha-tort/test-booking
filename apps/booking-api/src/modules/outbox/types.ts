import { BookingApiTransportDto } from '@libs/shared';

export enum TypeOutBoxEventEnum {
  BOOKING_CREATED = BookingApiTransportDto.createdBooking.topic,
}

export interface QueueEvent<T extends object = object> {
  eventId: string;
  payload: T;
}
