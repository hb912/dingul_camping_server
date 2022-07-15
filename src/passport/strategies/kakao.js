import { Strategy as KakaoStrategy } from 'passport-kakao';
import { userModel } from '../../db';

const config = {
  clientID: process.env.KAKAO_CLIENT_ID,
  clientSecret: '', // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
  callbackURL: 'http://localhost:5000/api/oauth',
};

const kakao = new KakaoStrategy(
  config,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userModel.findKakaoUser(profile.id);
      if (user) {
        done(null, user);
      } else {
        const newUser = await userModel.create({
          email: profile.id,
          name: profile.displayName,
          provider: 'kakao',
        });
        done(null, newUser);
      }
    } catch (error) {
      done(error);
    }
  }
);

export { kakao };
