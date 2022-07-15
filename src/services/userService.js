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

  // 사용자 목록을 받음.
  async getUsers() {
    const users = await this.userModel.findAll();
    return users;
  }

  async getUser(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async confirmPassword(userId, password) {
    console.log(userId);
    const user = await this.userModel.findById(userId);
    const correctPasswordHash = user.password;
    console.log(correctPasswordHash, password);
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      throw new Error(
        '현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
      );
    }
    return isPasswordCorrect;
  }

  // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
  async setUser(userInfoRequired, toUpdate) {
    // 객체 destructuring
    const { userId, currentPassword } = userInfoRequired;

    // // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findById(userId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    // if (!user) {
    //   throw new Error("가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
    // }

    // 이제, 정보 수정을 위해 사용자가 입력한 비밀번호가 올바른 값인지 확인해야 함

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        '현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
      );
    }

    // 이제 드디어 업데이트 시작

    // 비밀번호도 변경하는 경우에는, 회원가입 때처럼 해쉬화 해주어야 함.
    const { password } = toUpdate;

    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }

    // 업데이트 진행
    const updateUser = await this.userModel.update({
      userId,
      toUpdate,
    });

    return updateUser;
  }

  async deleteUser(userId) {
    const userOut = await this.userModel.delete(userId);
    return userOut;
  }
}

const userService = new UserService(userModel);

export { userService };
