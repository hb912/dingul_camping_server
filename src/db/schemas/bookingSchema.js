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
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
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
    status: {
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
