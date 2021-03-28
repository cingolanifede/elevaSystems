const mongoose = require('mongoose');
const config = require('./config');
const db_path = `mongodb://${config.mainDatabase.host}:27017/${config.mainDatabase.name}`;

// const db_path = `mongodb://${config.mainDatabase.user}:${config.mainDatabase.pass}@${config.mainDatabase.host}:27017/${config.mainDatabase.name}`;
console.log(db_path);
const db_config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

async function connectDb() {
  try {
    const connection = await mongoose.connect(db_path, db_config);
    console.log('MongoDB Succesful connection');
  } catch (error) {
    console.log('MongoDB Error connection', error);
  }
}
exports.connectDb = connectDb;
