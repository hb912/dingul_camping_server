import { bookingModel, roomModel } from '../db';
import moment from 'moment';

class BookingService {
  constructor(bookingModel) {
    this.bookingModel = bookingModel;
  }

  //startDate, stopDate로 새로운 배열 생성
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
      phone,
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
    const stringDates = dates.map((date) => new Date(date).toDateString());
    //예약하고 싶은 날짜에 예약이 존재하는지 확인
    const filteredDates = processDate.filter((date) =>
      stringDates.includes(new Date(date).toDateString())
    );
    if (filteredDates.length >= 1) {
      throw new Error('같은 날짜에 예약이 존재합니다.');
    }

    const newBooking = await this.bookingModel.create({
      processDate,
      name,
      roomID,
      peopleNumber,
      requirements,
      price,
      email,
      phone,
      userID,
    });

    if (!newBooking) {
      throw new Error('예약을 생성하는데 오류가 있습니다, 다시시도해주세요.');
    }

    return newBooking;
  }

  async getBooks() {
    const bookList = bookingModel.findAll();
    return bookList;
  }
}

const bookingService = new BookingService(bookingModel);

export { bookingService };
