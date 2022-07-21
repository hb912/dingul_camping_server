import { Router } from 'express';
import { bookingService } from '../services';
import { loginRequired } from '../middleware/loginRequired';

const bookingRouter = Router();

// {
//     "objectID": "book1",
//     "bookingDate": "2022-07-31 ~ 2022-08-02",
//     "userID": "a1b2c3",
//     "processDate": ["5", "6", "7"],
//     "RoomID": "room1",
//     "peopleNum": 3,
//     "requirements": "요구사항 없음",
//     "price": 30000,
//     "state": "예약요청",
//     "name": "김응애",
//     "email": "asdf@asdf.com",
//     "phone": "010-0101-1234"
//   },

bookingRouter.post('/create', loginRequired, async (req, res, next) => {
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
    if (new Date(startDate) < date)
      return res.status(400).json('과거의 예약은 진행할 수 없습니다.');

    const newUser = await bookingService.addBooking({
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

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

bookingRouter.get('/user', loginRequired, async (req, res, next) => {
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

bookingRouter.get('/confirm', loginRequired, async (req, res, next) => {
  try {
    const { startDate, endDate, roomID } = req.query;
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

bookingRouter.patch('/cancel', loginRequired, async (req, res, next) => {
  const { bookingID } = req.body;
  try {
    const result = await bookingService.changeStatus(bookingID, '취소 요청');
    if (result.status !== '취소 요청')
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
