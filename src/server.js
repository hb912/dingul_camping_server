import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import {
  userRouter,
  bookingRouter,
  roomRouter,
  adminRouter,
  reviewRouter,
} from './routers';
import passport from 'passport';
import passportConfig from './passport';
// import MongoStore from 'connect-mongo';
import { errorHandler, refresh, adminRequired } from './middleware';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
passportConfig();

app.use(passport.initialize());
app.use('/api', userRouter);
app.use('/api/room', roomRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', refresh, adminRequired, adminRouter);
app.use('/api/review', reviewRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`서버를 시작하였습니다. localhost:${PORT}`);
});
