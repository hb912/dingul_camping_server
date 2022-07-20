import { model } from 'mongoose';
import { RoomSchema } from '../schemas/roomSchema';

const Room = model('rooms', RoomSchema);

export class RoomModel {
  //특정룸찾기
  async findById(roomId) {
    const room = await Room.findOne({ _id: roomId });
    return room;
  }
  //룸생성
  async create(room) {
    const newRoom = await Room.create({ room });
    return newRoom;
  }
}

const roomModel = new RoomModel();

export { roomModel };
