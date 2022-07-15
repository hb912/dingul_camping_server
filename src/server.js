import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import { userRouter } from './routers';
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
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`서버를 시작하였습니다. localhost:${PORT}`);
});
