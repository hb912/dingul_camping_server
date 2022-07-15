import passport from 'passport';
import { local, jwt, kakao } from './strategies';

export default () => {
  // local strategy 사용
  passport.use(local);
  passport.use(jwt);
  passport.use(kakao);
};
