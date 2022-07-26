import passport from 'passport';
import { kakao } from './strategies';

export default () => {
  passport.use(kakao);
};
