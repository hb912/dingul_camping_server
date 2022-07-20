import { Router } from 'express';
import { userService, bookingService } from '../services';
import { passport } from 'passport';
import { loginRequired } from '../middleware/loginRequired';
import { adminRequired } from '../middleware/adminRequired';

const adminRouter = Router();

// 유저 리스트 가져오기
adminRouter.get('/user', async (req, res, next) => {
  try {
    const userList = await userService.getUsers();
    res.status(200).json(userList);
  } catch (e) {
    next(e);
  }
});

// 예약 리스트 가져오기
adminRouter.get('/book', async (req, res, next) => {
  try {
    const bookList = await bookingService.getBooks();
    res.status(200).json(bookList);
  } catch (e) {
    next(e);
  }
});

export { adminRouter };
