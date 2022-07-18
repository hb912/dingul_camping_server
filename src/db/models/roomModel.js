import { model } from 'mongoose';
import { RoomSchema } from '../schemas/userSchema';

const Room = model('rooms', RoomSchema);

export class RoomModel {
  //특정룸찾기
  async findById(roomId) {
    const room = await Room.findOne({ _id: roomId });
    return room;
  }
const roomModel = new RoomModel();

export { roomModel };
