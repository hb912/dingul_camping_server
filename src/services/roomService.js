import { roomModel } from '../db';

class RoomService {
  constructor(roomModel) {
    this.roomModel = roomModel;
  }

  async addRoom(room) {
    const exRoom = await this.roomModel.findByName(room.name);
    if (exRoom) {
      throw new Error('이미 존재하는 방 입니다.');
    }
    const newRoom = await this.roomModel.create(room);
    return newRoom;
  }

  async getAll() {
    const rooms = await this.roomModel.findAll();
    return rooms;
  }

  async getRoomInfo(roomId) {
    const roomInfo = await this.roomModel.findById(roomId);
    return roomInfo;
  }
}

const roomService = new RoomService(roomModel);

export { roomService };
