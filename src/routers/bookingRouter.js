import { Router } from 'express';
import { bookingService } from '../services';
import { refresh } from '../middleware';

const bookingRouter = Router();

const STATUS = {
  CANCEL: '예약 취소',
  CANCEL_REQUEST: '예약 취소 요청',
  REQUEST: '예약 요청',
  ACCEPT_REQUEST: '예약 승인',
};

bookingRouter.post('/create', refresh, async (req, res, next) => {
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
  } = req.body;
  const userID = req.currentUserId;

  const date = new Date();
  date.setDate(date.getDate() - 1);
  try {
    if (endDate <= startDate)
      throw new Error('종료날짜가 시작날짜보다 작거나 같습니다.');
    if (new Date(startDate) < date)
      throw new Error('과거의 예약은 진행할 수 없습니다.');
    const result = await bookingService.getExistBooking(
      startDate,
      endDate,
      roomID
    );
    console.log(result);
    const newBooking = await bookingService.addBooking({
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
    });

    res.status(201).json(newBooking);
  } catch (error) {
    next(error);
  }
});

bookingRouter.get('/user', refresh, async (req, res, next) => {
  try {
    const userID = req.currentUserId;
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);
    const bookings = await bookingService.getByUserId(userID, perPage, page);
    res.status(200).json(bookings);
  } catch (e) {
    next(e);
  }
});

bookingRouter.get('/confirm', refresh, async (req, res, next) => {
  const { startDate, endDate, roomID } = req.query;

  const date = new Date();
  date.setDate(date.getDate() - 1);
  try {
    if (!startDate || !endDate || !roomID) {
      throw new Error(
        '시작날짜 혹은 종료날짜 혹은 객실이 선택되지 않았습니다.'
      );
    }
    if (endDate <= startDate)
      throw new Error('종료날짜가 시작날짜보다 작거나 같습니다.');
    if (new Date(startDate) < date)
      throw new Error('과거의 예약은 진행할 수 없습니다.');
    const result = await bookingService.getExistBooking(
      startDate,
      endDate,
      roomID
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

bookingRouter.get('/byDates', async (req, res, next) => {
  try {
    const { startDate, endDate, peopleNumber } = req.query;
    const rooms = await bookingService.getRoomsByDate(
      startDate,
      endDate,
      peopleNumber
    );
    res.status(200).json(rooms);
  } catch (e) {
    next(e);
  }
});

bookingRouter.get('/byRoom', async (req, res, next) => {
  try {
    const { roomID } = req.query;
    const dates = await bookingService.getDatesByRoomID(roomID);
    res.status(200).json(dates);
  } catch (e) {
    next(e);
  }
});

bookingRouter.patch('/cancel', refresh, async (req, res, next) => {
  const { bookingID } = req.body;
  try {
    const result = await bookingService.changeStatus(
      bookingID,
      STATUS.CANCEL_REQUEST
    );
    if (result.status !== STATUS.CANCEL_REQUEST)
      throw new Error('업데이트에 실패했습니다.');
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

bookingRouter.patch('/review', async (req, res, next) => {
  try {
    const { bookingID } = req.body;
    const result = await bookingService.changeReviewed(bookingID);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

bookingRouter.delete('/', async (req, res, next) => {
  try {
    const { bookingID } = req.body;
    const result = await bookingService.delete(bookingID);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

export { bookingRouter };
