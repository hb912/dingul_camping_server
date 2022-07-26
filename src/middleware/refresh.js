import jwt from 'jsonwebtoken';
import { userService } from '../services';

async function refresh(req, res, next) {
  const { refreshToken, accessToken } = req.cookies;
  const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
  //액세스 토큰이 있고 verify에 성공했을때
  if (accessToken) {
    try {
      const jwtDecoded = jwt.verify(accessToken, secretKey);
      const userId = jwtDecoded.userID;
      const userRole = jwtDecoded.role;
      req.currentUserId = userId;
      req.currentUserRole = userRole;
      next();
      return;
    } catch (e) {
      console.log('엑세스 토큰 만료');
    }
  }

  if (!refreshToken) {
    console.log('서비스 사용 요청이 있습니다.하지만, Authorization 토큰: 없음');
    res.status(403).json({
      result: 'forbidden-approach',
      reason: '로그인한 유저만 사용할 수 있는 서비스입니다.',
    });
    return;
  }

  //리프레쉬 토큰 있을때
  try {
    const refreshDecoded = jwt.verify(refreshToken, secretKey);
    const user = await userService.getUserByRefreshToken(refreshToken);
    const newTokens = await userService.getUserToken(user);
    const result = await userService.setRefreshToken(
      newTokens.refreshToken,
      user._id
    );
    req.currentUserId = user._id;
    req.currentUserRole = user.role;
    res.cookie('accessToken', newTokens.accessToken, {
      maxAge: 90000,
      httpOnly: true,
    });
    res.cookie('userRole', user.role);
    res.cookie('refreshToken', newTokens.refreshToken, {
      maxAge: 90000,
      httpOnly: true,
    });
    next();
  } catch (e) {
    res.status(403).json({
      result: 'forbidden-approach',
      reason: '정상적인 토큰이 아닙니다.',
    });

    return;
  }
}

export { refresh };
