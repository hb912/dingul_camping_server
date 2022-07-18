import { Router } from 'express';
import { roomService } from '../services/roomService';

const roomRouter = Router();

//방 정보 가져오기
roomRouter.get('/roomInfo', async (req, res, next) => {
  const { roomId } = req.body;
  try {
    const roomInfo = await roomService.getRoomInfo(roomId);
    if (!roomInfo) {
      throw new Error('해당하는 방의 정보가 없습니다.');
    }
    res.status(200).json(roomInfo);
  } catch (error) {
    next(error);
  }
});
});
export { roomRouter };
