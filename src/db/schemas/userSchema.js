import { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    role: {
      type: String,
      default: 'user',
    },
    provider: {
      type: String,
    },
  },
  {
    collection: 'users',
  }
);

export { UserSchema };
