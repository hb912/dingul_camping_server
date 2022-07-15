import { Schema } from 'mongoose';

const BookingSchema = new Schema(
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
    price: {
      type: Number,
      required: true,
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
      required: true,
    },
    isReviewed: {
      type: Boolean,
      required: true,
    },
  },
  {
    collection: 'booking',
    timestamps: true,
  }
);

export { BookingSchema };
