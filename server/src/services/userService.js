import { userModel } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // 회원가입
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
