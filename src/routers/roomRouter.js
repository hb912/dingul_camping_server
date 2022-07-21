import { Router } from 'express';
import { roomService } from '../services/roomService';

const roomRouter = Router();

//방 정보 가져오기
roomRouter.get('/:roomID', async (req, res, next) => {
  const { roomID } = req.query;
  try {
    const roomInfo = await roomService.getRoomInfo(roomID);
    if (!roomInfo) {
      throw new Error('해당하는 방의 정보가 없습니다.');
    }
    res.status(200).json(roomInfo);
  } catch (error) {
    next(error);
  }
});

roomRouter.post('/create', async (req, res, next) => {
  const { name, price, content, imgSrc, maxPeople, minPeople } = req.body;
  try {
    const newRoom = await roomService.addRoom({
      name,
      price,
      content,
      imgSrc,
      maxPeople,
      minPeople,
    });
    res.status(200).json(newRoom);
  } catch (e) {
    next(e);
  }
});
export { roomRouter };
