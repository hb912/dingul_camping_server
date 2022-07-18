import { model } from 'mongoose';
import { BookingSchema } from '../schemas/bookingSchema';

const Booking = model('booking', BookingSchema);

export class BookingModel {
  async findByUserId(userId) {
    const bookingInfos = await Booking.findOne({ userId });
    return bookingInfos;
  }

  //booking ID와 일치하는 BookingInfo 찾기
  async findById(bookingId) {
    const bookingInfo = await Booking.findOne({ _id: bookingId });
    return bookingInfo;
  }

  async findByRoomId(roomId) {
    const bookingInfos = await Booking.findOne({ roomId });
    return bookingInfos;
  }

  async findDatesByRoomId(roomId) {
    const findDates = await Booking.find(
      { roomId },
      { _id: 0, processDate: 1 }
    );
    const dates = Object.values(findDates);
    const joinDates = new Array();
    dates.map((date) => {
      joinDates.push(date.processDate);
    });
    const result = joinDates.reduce(function (acc, cur) {
      return [...acc, ...cur];
    });

    return result;
  }

  async findByDate(dates) {
    const disableRooms = await Booking.find(
      { processDate: { $in: dates } },
      { _id: 0, roomID: 1 }
    ).populate('roomID');
    return disableRooms;
  }

  //부킹 도큐먼트 생성
  async create(bookingInfo) {
    const newBooking = await Booking.create(bookingInfo);
    return newBooking;
  }

  // 모든 부킹 정보 가져오기
  async findAll() {
    const bookings = await Booking.find({});
    return bookings;
  }

  //주문상태변경
  async updateStatus({ bookingId, status }) {
    const filter = { _id: bookingId };
    const option = { returnOriginal: false };

    const updatedBooking = await Booking.findOneAndUpdate(
      filter,
      status,
      option
    );
    return updatedBooking;
  }

  async delete(bookingId) {
    const result = await Booking.deleteOne({ _id: bookingId });
    return result;
  }
}

const bookingModel = new BookingModel();

export { bookingModel };
