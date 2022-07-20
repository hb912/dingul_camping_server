import { Router } from 'express';
import { userService } from '../services';
import passport from 'passport';
import { loginRequired } from '../middleware/loginRequired';
import bcrypt from 'bcrypt';

const userRouter = Router();

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

userRouter.post('/login', async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    console.log(info);
    if (err || !user) {
      return res.status(400).json(err.message);
    }

    req.login(user, { session: false }, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      const token = await userService.getUserToken(user);
      res.status(200).json({ message: 'OK', token });
    });
  })(req, res, next);
});

//처음 프론트가 보내줄 get 경로
userRouter.get(
  '/kakao',
  passport.authenticate('kakao', {
    failureRedirect: '/', // 실패했을 경우 리다이렉트 경로
  })
);

//redirectURL
userRouter.get(
  '/oauth',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  async (req, res) => {
    console.log(`req:${req.user}`);
    if (!req.user) {
      return res.status(400).json('error');
    }
    const token = await userService.getUserToken(req.user);
    res.status(200).json({ message: 'OK', token });
  }
);

//패스워드 확인
userRouter.get('/confirmPW', loginRequired, async (req, res, next) => {
  const { password } = req.body;
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

userRouter.get('/user', loginRequired, async (req, res, next) => {
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

userRouter.get('/logout', loginRequired, async (req, res) => {
  req.logout();
  req.session.save(function () {
    res.status(200).json({ message: 'Ok' });
  });
});

userRouter.delete('/user', loginRequired, async (req, res, next) => {
  if (!req.currentUserId) {
    res.status(400).json('유저정보를 찾을 수 없습니다.');
  }
  try {
    const result = await userService.delete(req.currentUserId);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

export { userRouter };
