import { Router } from 'express';
import { userService, bookingService } from '../services';

const adminRouter = Router();

// 전체 유저 리스트 가져오기
adminRouter.get('/users', async (req, res, next) => {
  try {
    const userList = await userService.getUsersSorted();
    res.status(200).json(userList);
  } catch (e) {
    next(e);
  }
});

// 유저 리스트 이름으로 찾기
adminRouter.get('/user', async (req, res, next) => {
  try {
    const { name } = req.query;
    const userList = await userService.getUsersByName(name);
    res.status(200).json(userList);
  } catch (e) {
    next(e);
  }
});

// 예약 리스트 전부 가져오기
adminRouter.get('/book', async (req, res, next) => {
  try {
    const bookList = await bookingService.getBooks();
    res.status(200).json(bookList);
  } catch (e) {
    next(e);
  }
});

// 예약 리스트 나눠서 가져오기
adminRouter.get('/books', async (req, res, next) => {
  try {
    const { request } = req.query;

    if (request == true) {
      const bookRequestLists = await bookingService.getBookRequests();
      res.status(200).json(bookRequestLists);
    } else {
      const bookLists = await bookingService.getBooksExceptRequests();
      res.status(200).json(bookLists);
    }
  } catch (e) {
    next(e);
  }
});

// 회원 탈퇴 처리
adminRouter.delete('/user', async (req, res, next) => {
  try {
    const { userId } = req.body;
    const deleteUser = await userService.deleteUser(userId);
    res.status(200).json(deleteUser);
  } catch (e) {
    next(e);
  }
});

// 예약 처리
adminRouter.patch('/book', async (req, res, next) => {
  try {
    const { bookingID, status } = req.body.data;
    const changeStatus = await bookingService.changeStatus(bookingID, status);
    res.status(200).json(changeStatus);
  } catch (e) {
    next(e);
  }
});

export { adminRouter };
