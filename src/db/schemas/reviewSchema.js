import { Schema } from 'mongoose';

const ReviewSchema = new Schema(
  {
    RoomID: {
      type: Schema.Types.ObjectID,
      required: true,
      ref: 'rooms',
    },
    userID: {
      type: Schema.Types.ObjectID,
      required: true,
      ref: 'users',
    },
    BookingID: {
      type: Schema.Types.ObjectID,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    grade: {
      type: Number,
      required: true,
    },
  },
  {
    collection: 'reviews',
    timestamps: true,
  }
);

export { ReviewSchema };
