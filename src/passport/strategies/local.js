import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { userModel } from '../../db';

const config = {
  usernameField: 'email',
  passwordField: 'password',
  session: false,
};

//passport의 localstrategy는 local db의 정보를 이용해 쿠키와 세션을 통해 사용자 인증을 수행하는 방법이다.
//strategy의 첫번째 인자에서는 각각 field에 req.body의 속성명을 담아주어야 한다.
//두번째 인자에서는 실제 전략을 수행하는 로직을 작성한다, 유저가 존재하는지, 비밀번호가 일치하는지 등의 로직 작성한다.
//여기서 궁금한점 - strategy안에서 토큰을 받아와서 done으로 토큰을 보내주는 것이 좋을까 그냥 유저를 통째로 보내주는 것이 좋을까(done값을 세션에 저장하진 않는다.)
//토큰을 sendcookie로 보내주는것이 좋을까 그냥 json 파일로 보내주는 것이 좋을까?
const local = new LocalStrategy(config, async (email, password, done) => {
  try {
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error(
        '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.'
      );
    }

    const correctPasswordHash = user.password; // db에 저장되어 있는 암호화된 비밀번호

    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
      );
    }

    //done 함수의 첫번째 인자는 err, 두번째 인자는 결과값, 세번째 인자는 실패 혹은 성공에 대한 정보
    return done(null, user, { message: 'OK' });
  } catch (err) {
    return done(err, false, { message: err.message });
  }
});

export { local };
