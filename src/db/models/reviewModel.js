import { model } from 'mongoose';
import { ReviewSchema } from '../schemas/reviewSchema';

const Review = model('reviews', ReviewSchema);

export class ReviewModel {
  async findByBookingId(bookingID) {
    //리뷰아이디로 리뷰 찾기(리뷰조회모달이 만약 있을시 사용)
    const review = await Review.findOne({ bookingID });
    return review;
  }

  async findById(reviewID) {
    //리뷰아이디로 리뷰 찾기(리뷰조회모달이 만약 있을시 사용)
    const review = await Review.findOne({ reviewID });
    return review;
  }

  async findByRoomId(roomID, perPage, page) {
    const total = await Review.countDocuments({ roomID });
    const reviews = await Review.find({ roomID })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage);
    const totalPage = Math.ceil(total / perPage);
    return { reviews, totalPage, page };
  }

  async findByUserId(userId) {
    const Reviews = await Review.find({ userID: userId });
    return Reviews;
  }

  async create(reviewInfo) {
    const newReview = await Review.create(reviewInfo);
    return newReview;
  }

  async update({ reviewID, ...update }) {
    //리뷰 수정(아마도 비밀번호 변경 혹은 주소 변경)
    const filter = { _id: reviewID };
    const option = { returnOriginal: false };

    const updatedReview = await Review.findOneAndUpdate(filter, update, option);
    return updatedReview;
  }

  async delete(reviewID) {
    const deleteReview = await Review.deleteOne({ _id: reviewID });
    return deleteReview;
  }
}

const reviewModel = new ReviewModel();

export { reviewModel };
