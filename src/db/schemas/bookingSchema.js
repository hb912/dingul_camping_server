import { Schema } from 'mongoose';

const BookingSchema = new Schema(
  {
    roomID: {
      type: Schema.Types.ObjectID,
      required: true,
      ref: 'rooms',
    },
    userID: {
      type: Schema.Types.ObjectID,
      required: true,
      ref: 'users',
    },
    price: {
      type: Number,
      required: true,
    },
    processDate: {
      type: [Date],
    },
    peopleNumber: {
      type: Number,
      required: true,
    },
    requirements: {
      type: String,
    },
    state: {
      type: String,
      default: '예약 요청',
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'booking',
    timestamps: true,
  }
);

export { BookingSchema };
