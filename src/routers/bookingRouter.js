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

bookingRouter.get('/byDates', async (req, res, next) => {
  try {
    const { startDate, endDate, peopleNumber } = req.body;
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
    const { roomID } = req.body;
    const rooms = await bookingService.getDatesByRoomID(roomID);
    res.status(200).json(rooms);
  } catch (e) {
    next(e);
  }
});
export { bookingRouter };
