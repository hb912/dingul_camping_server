import { roomModel } from '../db';

class RoomService {
  constructor(roomModel) {
    this.roomModel = roomModel;
  }

  async addRoom(roomInfo) {
    const newRoom = await this.roomModel.create(roomInfo);
    return newRoom;
  }

  async getRoomInfo(roomId) {
    const roomInfo = await this.roomModel.findById(roomId);
    return roomInfo;
  }
}

const roomService = new RoomService(roomModel);

export { roomService };
