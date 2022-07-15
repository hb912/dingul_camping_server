import { Router } from 'express';
import { userService } from '../services';
import passport from 'passport';
import { loginRequired } from '../middleware/loginRequired';

const userRouter = Router();

// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
userRouter.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await userService.addUser({
      name,
      email,
      password,
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

userRouter.get('/auth', loginRequired, (req, res, next) => {
  console.log(req.currentUserId);
  res.status(200).json(req.currentUserId);
});

userRouter.get(
  '/kakao',
  passport.authenticate('kakao', {
    failureRedirect: '/', // 실패했을 경우 리다이렉트 경로
  })
);

userRouter.get('/oauth', passport.authenticate('kakao'));

export { userRouter };
