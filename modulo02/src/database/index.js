import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';
import File from '../app/models/File';
import User from '../app/models/user';
import Appointments from '../app/models/Appointments';

const models = [User, File, Appointments];

class DataBase {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb+srv://admin:31994@cluster0-n2ppb.mongodb.net/test?retryWrites=true&w=majority',
      { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
    );
  }
}
export default new DataBase();
