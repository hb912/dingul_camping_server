import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import { userRouter, bookingRouter, roomRouter, adminRouter } from './routers';
import passport from 'passport';
import passportConfig from './passport';
// import MongoStore from 'connect-mongo';
import session from 'express-session';
import { errorHandler } from './middleware';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
passportConfig();

app.use(
  session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
    // store: MongoStore.create({
    //   mongoUrl: process.env.MONGODB_URL,
    // }),
  })
);
app.use(passport.initialize());
app.use('/api', userRouter);
app.use('/api', roomRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`서버를 시작하였습니다. localhost:${PORT}`);
});
