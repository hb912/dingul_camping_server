import passport from 'passport';

function loginRequired(req, res, next) {
  const userToken = req.headers['authorization']?.split(' ')[1];
  if (!userToken || userToken === 'null') {
    console.log('서비스 사용 요청이 있습니다.하지만, Authorization 토큰: 없음');
    res.status(403).json({
      result: 'forbidden-approach',
      reason: '로그인한 유저만 사용할 수 있는 서비스입니다.',
    });

    return;
  }

  return passport.authenticate('jwt', { session: false }, function (err, user) {
    if (err || user === false) {
      return res.status(403).json({
        result: 'forbidden-approach',
        reason: '정상적인 토큰이 아닙니다.',
      });
    }
    req.currentUserId = user.userId;
    req.currentUserRole = user.userRole;
    next();
  })(req, res, next);
}

export { loginRequired };
