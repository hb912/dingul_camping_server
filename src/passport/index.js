import passport from 'passport';
import { local, jwt, kakao } from './strategies';

export default () => {
  // local strategy 사용
  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    console.log(obj);
    done(null, obj);
  });

  passport.use(local);
  passport.use(jwt);
  passport.use(kakao);
};
