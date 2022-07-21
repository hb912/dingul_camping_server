import { reviewModel } from '../db';

class ReviewService {
  constructor(reviewModel) {
    this.reviewModel = reviewModel;
  }

  // review 생성
  async addReview(reviewInfo) {
    const newReview = await reviewModel.create(reviewInfo);

    if (!newReview) {
      throw new Error('리뷰를 생성하는데 오류가 있습니다, 다시시도해주세요.');
    }

    return newReview;
  }

  //유저의 리뷰 조회
  async getByUserId(userID, perPage, page) {
    if (!userID) {
      throw new Error('유저 정보가 없습니다.');
    }
    const reviews = await this.reviewModel.findByUserId(userID, perPage, page);
    return reviews;
  }

  //유저가 사용할 날짜별 가능한 룸
  async getRoomReview(roomID, perPage, page) {
    const reviews = await this.reviewModel.findByRoomId(roomID, perPage, page);
    return reviews;
  }

}

const reviewService = new ReviewService(reviewModel);

export { reviewService };
