import { Router } from 'express';
import { loginRequired } from '../middleware';
import { reviewService } from '../services';

const reviewRouter = Router();
// roomID: {
//   type: Schema.Types.ObjectID,
//   required: true,
//   ref: 'rooms',
// },
// userID: {
//   type: Schema.Types.ObjectID,
//   required: true,
//   ref: 'users',
// },
// BookingID: {
//   type: Schema.Types.ObjectID,
//   required: true,
// },
// title: {
//   type: String,
//   required: true,
// },
// content: {
//   type: String,
// },
// grade: {
//   type: Number,
//   required: true,
// },
// cron => scheduler node scheduler
//방 정보 가져오기
reviewRouter.get('/', async (req, res, next) => {
  const { roomID } = req.query;
  const page = Number(req.query.page || 1);
  const perPage = Number(req.query.perPage || 5);
  try {
    const reviews = await reviewService.getRoomReview(roomID, perPage, page);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});

reviewRouter.post('/create', loginRequired, async (req, res, next) => {
  const { roomID, bookingID, content, title, grade, name } = req.body;
  console.log(bookingID);
  const userID = req.currentUserId;
  try {
    const newReview = await reviewService.addReview({
      roomID,
      bookingID,
      content,
      title,
      grade,
      name,
      userID,
    });
    res.status(201).json(newReview);
  } catch (e) {
    next(e);
  }
});
export { reviewRouter };
