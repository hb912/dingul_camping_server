import { Schema } from 'mongoose';

const RoomSchema = new Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
    },
    imgSrc: {
      type: [String],
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    minPeople: {
      type: Number,
      required: true,
    },
  },
  {
    collection: 'rooms',
  }
);

export { RoomSchema };
