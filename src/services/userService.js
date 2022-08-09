import { userModel } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // 회원가입
  async addUser(userInfo) {
    const { email, name, password, phoneNumber } = userInfo;

    // 이메일 중복 확인
    const user = await this.userModel.findByEmail(email);
    if (user) {
      throw new Error(
        '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.'
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserInfo = { name, email, password: hashedPassword, phoneNumber };
    const createdNewUser = await this.userModel.create(newUserInfo);
    return createdNewUser;
  }

  async setRefreshToken(refreshToken, userID) {
    const result = await this.update({ userID, refreshToken });
    return result;
  }

  async getUserToken(user) {
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    // 2개 프로퍼티를 jwt 토큰에 담음
    const accessToken = jwt.sign({ userID: user._id }, secretKey, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign({}, secretKey, {
      expiresIn: '14d',
    });
    return { accessToken, refreshToken };
  }

  async getAccessToken(user) {
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    // 2개 프로퍼티를 jwt 토큰에 담음
    const accessToken = jwt.sign({ userID: user._id }, secretKey, {
      expiresIn: '1d',
    });

    return accessToken;
  }

  async getUserByRefreshToken(refreshToken) {
    const user = await this.userModel.findByToken(refreshToken);
    if (!user) {
      throw new Error('올바르지 않은 토큰입니다 로그인을 다시해주세요.');
    }
    return user;
  }

  // 로그인
  async verifyPassword(email, password, autoLogin) {
    // 로그인 성공 -> JWT 웹 토큰 생성
    const user = await this.userModel.findByEmail(email);
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
    const role = user.role;
    if (autoLogin) {
      const { accessToken, refreshToken } = await this.getUserToken(user);
      await this.setRefreshToken(refreshToken, user._id);
      return { accessToken, refreshToken, role };
    }
    const accessToken = await this.getAccessToken(user);
    return { accessToken, role };
  }

  // 사용자 목록을 받음.
  async getUsers() {
    const users = await this.userModel.findAll();
    return users;
  }

  async getUsersSorted() {
    const users = await this.userModel.findAllSorted();
    return users;
  }

  async findUserEmail(name, phoneNumber) {
    const user = await this.userModel.findByName(name, phoneNumber);
    return user;
  }

  async getUsersByName(name) {
    const user = await this.userModel.findAllByName(name);
    return user;
  }

  async getUser(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async getUserByEmail(email) {
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error('가입 내역이 없는 이메일입니다.');
    }
    return user;
  }

  // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
  async update({ userID, ...update }) {
    let user = await this.userModel.findById(userID);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const { password } = update;

    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      update.password = newPasswordHash;
    }
    // 업데이트 진행
    const updateUser = await this.userModel.update({
      userID,
      update,
    });

    return updateUser;
  }

  async deleteUser(userId) {
    const result = await this.userModel.deleteUser(userId);
    return result;
  }
}

const userService = new UserService(userModel);

export { userService };
