import { model } from 'mongoose';
import { BookingSchema } from '../schemas/bookingSchema';

const Booking = model('booking', BookingSchema);

export class BookingModel {
  async findByUserId(userID, perPage, page) {
    const total = await Booking.countDocuments({ userID });
    const bookingInfos = await Booking.find({ userID })
      .sort({ startDate: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .populate('roomID');
    const totalPage = Math.ceil(total / perPage);
    return { bookingInfos, totalPage, page };
  }

  //booking ID와 일치하는 BookingInfo 찾기
  async findById(bookingId) {
    const bookingInfo = await Booking.findOne({ _id: bookingId });
    return bookingInfo;
  }

  async findByRoomId(roomId) {
    const bookingInfos = await Booking.find({ roomId });
    return bookingInfos;
  }

  async findDatesByRoomId(roomID) {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    const findDates = await Booking.find(
      {
        roomID,
        startDate: { $gte: date },
      },
      { _id: 0, processDate: 1 }
    ).sort({ startDate: 1 });
    if (!findDates || findDates.length < 1) {
      return;
    }

    const dates = Object.values(findDates);
    const joinDates = dates.map((date) => {
      return date.processDate;
    });
    const bookedDates = joinDates.reduce(function (acc, cur) {
      return [...acc, ...cur];
    });
    return bookedDates;
  }

  async findRoomsByDate(stringDates) {
    const dates = stringDates.map((date) => new Date(date));
    const disableRooms = await Booking.find(
      { processDate: { $in: dates } },
      { _id: 0, roomID: 1 }
    ).distinct('roomID');

    return disableRooms;
  }

  async findByDate(stringDates) {
    const dates = stringDates.map((date) => new Date(date));
    const disableRooms = await Booking.find({ processDate: { $in: dates } });

    return disableRooms;
  }

  //부킹 도큐먼트 생성
  async create(bookingInfo) {
    const newBooking = await Booking.create(bookingInfo);
    return newBooking;
  }

  // 모든 부킹 정보 가져오기
  async findAll() {
    const bookings = await Booking.find({}).populate('roomID');
    return bookings;
  }

  // 모든 부킹 요청 가져오기
  async findRequests() {
    const bookings = await Booking.find({ status: '예약 요청' }).populate(
      'roomID'
    );
    return bookings;
  }

  async findAllExceptRequests() {
    const bookings = await Booking.find({
      status: { $in: ['예약 완료', '예약 취소', '예약 취소 요청'] },
    })
      .sort({ startDate: 1 })
      .populate('roomID');
    return bookings;
  }

  //주문상태변경
  async updateStatus({ bookingID, status }) {
    const filter = { _id: bookingID };
    const option = { returnOriginal: false };
    const updatedBooking = await Booking.findOneAndUpdate(
      filter,
      { status },
      option
    );
    return updatedBooking;
  }

  async updateReviewed(bookingID) {
    const filter = { _id: bookingID };
    const option = { returnOriginal: false };
    const updatedBooking = await Booking.findOneAndUpdate(
      filter,
      { isReviewed: true },
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
