import mongoose from 'mongoose';

const DB_URL = //mongodb url .env파일의 MONGODB_URL
  process.env.MONGODB_URL || 'MongoDB 서버 주소가 설정되지 않았습니다.';

mongoose.connect(DB_URL); //db연결
const db = mongoose.connection;

db.on('connected', () =>
  console.log('정상적으로 MongoDB 서버에 연결되었습니다.  ' + DB_URL)
);
db.on('error', (error) =>
  console.error('\nMongoDB 연결에 실패하였습니다...\n' + DB_URL + '\n' + error)
);

export * from './models/userModel';
export * from './models/roomModel';
export * from './models/bookingModel';
