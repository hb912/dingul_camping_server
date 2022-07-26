import { Router } from 'express';
import { userService, mailer } from '../services';
import passport from 'passport';
import { refresh } from '../middleware';
import bcrypt from 'bcrypt';
import * as redis from 'redis';

const userRouter = Router();

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient.connect();
redisClient.on('error', (err) => {
  console.log(err);
});
redisClient.on('ready', () => {
  console.log('정상적으로 Redis 서버에 연결되었습니다.');
});

userRouter.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const newUser = await userService.addUser({
      name,
      email,
      password,
      phoneNumber,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/login', async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const { accessToken, role, refreshToken } =
      await userService.verifyPassword(email, password);
    res.cookie('accessToken', accessToken, { maxAge: 90000 });
    res.cookie('userRole', role);
    res.cookie('refreshToken', refreshToken, { maxAge: 90000 });
    res.status(200).send({ message: 'success' });
  } catch (err) {
    next(err);
  }
});

//처음 프론트가 보내줄 get 경로
userRouter.get(
  '/kakao',
  passport.authenticate('kakao', {
    failureRedirect: '/',
    session: false, // 실패했을 경우 리다이렉트 경로
  })
);

//redirectURL
userRouter.get(
  '/oauth',
  passport.authenticate('kakao', {
    failureRedirect: '/',
    session: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).json('error');
    }
    const { accessToken, refreshToken } = await userService.getUserToken(
      req.user
    );
    const result = await userService.setRefreshToken(
      refreshToken,
      req.user._id
    );
    const role = req.user.role;
    res.cookie('accessToken', accessToken, { maxAge: 90000 });
    res.cookie('userRole', role);
    res.cookie('refreshToken', refreshToken, { maxAge: 90000 });
    // res.status(200).send({ message: 'success' });
    res.redirect(`http://localhost:3000/`);
  }
);

//패스워드 확인
userRouter.get('/confirmPW', refresh, async (req, res, next) => {
  const { password } = req.query;
  try {
    const user = await userService.getUser(req.currentUserId);
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );
    if (!isPasswordCorrect) {
      throw new Error(
        '현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
      );
    }
    res.status(200).json(isPasswordCorrect);
  } catch (error) {
    next(error);
  }
});

userRouter.get('/user', refresh, async (req, res, next) => {
  if (!req.currentUserId) {
    res.status(400).json('유저정보를 찾을 수 없습니다.');
  }
  try {
    const user = await userService.getUser(req.currentUserId);
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

userRouter.get('/logout', refresh, async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('userRole');
  res.status(200).json({ message: 'Ok' });
});

userRouter.post('/newPassword', async (req, res, next) => {
  const { email, name } = req.body;
  const number = Math.random().toString(18).slice(2);
  try {
    const user = await userService.getUserByEmail(email);
    if (name !== user.name) {
      throw new Error('이름이 일치하지 않습니다.');
    }
    const saveKey = await redisClient.setEx(number, 180, user.email);
    if (!saveKey) {
      throw new Error('redis 저장에 실패했습니다.');
    }
    const result = await mailer(user.email, number);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

userRouter.get('/newPassword/:redisKey', async (req, res, next) => {
  const { redisKey } = req.params;
  try {
    const userID = await redisClient.get(redisKey);
    if (!userID) {
      throw new Error('유효기간이 지났거나 잘못된 링크입니다.');
    }
    res.status(200).json(userID);
  } catch (e) {
    next(e);
  }
});

userRouter.get('/findEmail', async (req, res, next) => {
  const { name } = req.query;
  if (!name) {
    res.status(400).json({ result: 'error', reason: '이름을 입력해 주세요.' });
  }
  try {
    const user = await userService.getUserByName(name);
    if (!user) {
      res
        .status(400)
        .json({ result: 'error', reason: '유저정보를 찾을 수 없습니다.' });
    }
    const { email } = user;
    res.status(200).json(email);
  } catch (e) {
    next(e);
  }
});

userRouter.patch('/password', async (req, res, next) => {
  try {
    const { password, email, redisKey } = req.body;
    await redisClient.del(redisKey);
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new Error('유저 정보를 찾을 수 없습니다');
    }
    const result = await userService.update({
      password,
      userID: user._id,
    });
    if (!result) {
      throw new Error('유저정보를 찾을 수 없습니다.');
    }
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

userRouter.patch('/user', refresh, async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const userID = req.currentUserId;
    const result = await userService.update({
      name,
      email,
      password,
      phoneNumber,
      userID,
    });
    if (!result) {
      throw new Error('유저정보를 찾을 수 없습니다.');
    }
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

userRouter.delete('/user', refresh, async (req, res, next) => {
  if (!req.currentUserId) {
    res
      .status(400)
      .json({ result: 'error', reason: '유저정보를 찾을 수 없습니다.' });
  }
  try {
    const result = await userService.deleteUser(req.currentUserId);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

export { userRouter };
