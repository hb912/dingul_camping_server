import { bookingModel, roomModel } from '../db';
import moment from 'moment';

class BookingService {
  constructor(bookingModel) {
    this.bookingModel = bookingModel;
  }

  //startDate, stopDate로 새로운 날짜 배열 생성
  getDates(startDate, stopDate) {
    let dateArray = new Array();
    let currentDate = moment(startDate).format('YYYY-MM-DD');
    let stop = moment(stopDate).format('YYYY-MM-DD');
    while (currentDate < stop) {
      dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
      currentDate = moment(currentDate).add(1, 'days').format('YYYY-MM-DD');
    }
    return dateArray;
  }

  // booking 생성
  async addBooking(bookingInfo) {
    const {
      startDate,
      endDate,
      name,
      roomID,
      peopleNumber,
      requirements,
      price,
      email,
      phoneNumber,
      userID,
    } = bookingInfo;

    const roomInfo = await roomModel.findById(roomID);
    //room id로 조회 후 정원이 맞는지 확인
    if (
      peopleNumber > roomInfo.maxPeople ||
      peopleNumber < roomInfo.minPeople
    ) {
      throw new Error('정원이 맞지 않습니다.');
    }

    const processDate = this.getDates(startDate, endDate);
    const dates = await this.bookingModel.findDatesByRoomId(roomID);
    if (dates) {
      const stringDates = dates.map((date) => new Date(date).toDateString());
      //예약하고 싶은 날짜에 예약이 존재하는지 확인
      const filteredDates = processDate.filter((date) =>
        stringDates.includes(new Date(date).toDateString())
      );
      if (filteredDates.length >= 1) {
        throw new Error('같은 날짜에 예약이 존재합니다.');
      }
    }

    const newBooking = await this.bookingModel.create({
      processDate,
      name,
      roomID,
      peopleNumber,
      requirements,
      price,
      email,
      phoneNumber,
      userID,
      startDate,
      endDate,
    });

    if (!newBooking) {
      throw new Error('예약을 생성하는데 오류가 있습니다, 다시시도해주세요.');
    }

    return newBooking;
  }

  //유저의 마이페이지 예약 조회
  async getByUserId(userID, perPage, page) {
    if (!userID) {
      throw new Error('유저 정보가 없습니다.');
    }
    const bookings = await this.bookingModel.findByUserId(
      userID,
      perPage,
      page
    );
    return bookings;
  }

  //유저가 사용할 날짜별 가능한 룸
  async getRoomsByDate(startDate, endDate, peopleNumber) {
    const stringDates = this.getDates(startDate, endDate);
    const rooms = await bookingModel.findRoomsByDate(stringDates);
    const allRooms = await roomModel.findAll();
    allRooms.map((room) => {
      if (room.minPeople > peopleNumber || room.maxPeople < peopleNumber)
        rooms.push(room._id);
    });
    const set = new Set(JSON.parse(JSON.stringify(rooms)));
    return [...set];
  }

  async getExistBooking(startDate, endDate, roomID) {
    const processDate = this.getDates(startDate, endDate);
    const dates = await this.bookingModel.findDatesByRoomId(roomID);
    if (dates) {
      const stringDates = dates.map((date) => new Date(date).toDateString());
      //예약하고 싶은 날짜에 예약이 존재하는지 확인
      const filteredDates = processDate.filter((date) =>
        stringDates.includes(new Date(date).toDateString())
      );
      if (filteredDates.length >= 1) {
        throw new Error('같은 날짜에 이미 예약이 존재합니다.');
      }
    }
    return { message: 'Ok' };
  }

  //admin이 사용할 날짜별 주문조회
  async getByDate(startDate, endDate) {
    if (!startDate || !endDate) {
      throw new Error('시작 날짜 혹은 종료 날짜가 없습니다.');
    }
    const stringDates = this.getDate(startDate, endDate);
    const bookings = await bookingModel.findByDate(stringDates);
    return bookings;
  }

  //RoomID로 가능한 날짜 조회
  async getDatesByRoomID(roomID) {
    const dates = await this.bookingModel.findDatesByRoomId(roomID);
    return dates;
  }

  async changeStatus(bookingID, status) {
    const result = await this.bookingModel.updateStatus({ bookingID, status });
    return result;
  }

  async changeReviewed(bookingID) {
    const date = new Date();
    const booking = await this.bookingModel.findById(bookingID);
    if (!booking) {
      throw new Error('해당 예약 내역이 없습니다.');
    }
    if (booking.endDate > date)
      throw new Error('지난 예약만 리뷰를 작성할 수 있습니다.');
    const result = this.bookingModel.updateReviewed(bookingID);
    return result;
  }

  async delete(bookingID) {
    const result = await this.bookingModel.delete(bookingID);
    return result;
  }

  async getBooks() {
    const bookList = bookingModel.findAll();
    return bookList;
  }

  async getBookRequests() {
    const bookRequests = bookingModel.findRequests();
    return bookRequests;
  }

  async getBooksExceptRequests() {
    const booklist = bookingModel.findAllExceptRequests();
    return booklist;
  }
}

const bookingService = new BookingService(bookingModel);

export { bookingService };
