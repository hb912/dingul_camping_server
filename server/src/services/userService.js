import { userModel } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // 회원가입
  async addUser(userInfo) {
    const { email, name, password } = userInfo;

    // 이메일 중복 확인
    const user = await this.userModel.findByEmail(email);
    if (user) {
      throw new Error(
        '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.'
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserInfo = { name, email, password: hashedPassword };
    const createdNewUser = await this.userModel.create(newUserInfo);
    return createdNewUser;
  }

  // 로그인
  async getUserToken(user) {
    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    // 2개 프로퍼티를 jwt 토큰에 담음
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);
    const role = user.role;
    return { token, role };
  }

  async getUser(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }
