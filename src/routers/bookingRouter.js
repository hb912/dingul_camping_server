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
  try {
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
    } = req.body;
    const userID = req.currentUserId;
    const newUser = await bookingService.addBooking({
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
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

export { bookingRouter };
