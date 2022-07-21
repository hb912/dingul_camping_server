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

}

const reviewService = new ReviewService(reviewModel);

export { reviewService };
