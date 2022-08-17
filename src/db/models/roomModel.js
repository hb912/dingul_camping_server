import { model } from 'mongoose';
import { RoomSchema } from '../schemas/roomSchema';

const Room = model('rooms', RoomSchema);

export class RoomModel {
  //특정룸찾기
  async findById(roomId) {
    const room = await Room.findOne({ _id: roomId });
    return room;
  }

  async findByName(name) {
    const room = await Room.findOne({ name });
    return room;
  }

  //룸생성
  async create(room) {
    const newRoom = await Room.create(room);
    return newRoom;
  }

  async findAll() {
    const rooms = await Room.find({});
    return rooms;
  }
}

const roomModel = new RoomModel();

export { roomModel };
