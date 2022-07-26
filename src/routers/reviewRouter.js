import { Router } from 'express';
import { refresh } from '../middleware';
import { reviewService } from '../services';

const reviewRouter = Router();

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

reviewRouter.get('/booking', async (req, res, next) => {
  const { bookingID } = req.query;
  try {
    const review = await reviewService.getReviewBybooking(bookingID);
    res.status(200).json(review);
  } catch (e) {
    next(e);
  }
});

reviewRouter.post('/create', refresh, async (req, res, next) => {
  const { roomID, bookingID, content, title, grade, name } = req.body;
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

reviewRouter.patch('/:reviewID', refresh, async (req, res, next) => {
  try {
    const { reviewID } = req.params;
    if (!reviewID) {
      throw new Error('해당 리뷰가 없습니다');
    }
    const { content, title, grade, name } = req.body;
    const result = await reviewService.changeReview({
      reviewID,
      content,
      title,
      grade,
      name,
    });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

reviewRouter.delete('/:reviewID', refresh, async (req, res, next) => {
  try {
    const { reviewID } = req.params;
    const result = await reviewService.delete(reviewID);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

export { reviewRouter };
