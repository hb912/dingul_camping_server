import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { userModel } from '../../db';

const option = {
  secretOrKey: process.env.JWT_SECRET_KEY || 'secret-key',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwt = new JWTStrategy(option, async function (jwtPayload, done) {
  try {
    console.log(jwtPayload);
    const user = await userModel.findById(jwtPayload.userId);
    if (user) return done(null, jwtPayload, { message: 'OK' });
    else return done(null, false, { message: '잘못된 토큰입니다.' });
  } catch (err) {
    return done(err, false, { message: '에러가 발생했습니다.' });
  }
});

export { jwt };
