import { Router } from 'express';
import { userService } from '../services';
import passport from 'passport';
import { loginRequired } from '../middleware/loginRequired';

const userRouter = Router();

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

export { userRouter };
