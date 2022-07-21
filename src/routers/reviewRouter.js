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
