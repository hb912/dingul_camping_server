import { roomModel } from '../db';

class RoomService {
  constructor(roomModel) {
    this.roomModel = roomModel;
  }

  async getRoomInfo(roomId) {
    const roomInfo = await this.roomModel.findById(roomId);
    return roomInfo;
  }
}

const roomService = new RoomService(roomModel);

export { roomService };
