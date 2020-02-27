import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import File from '../app/models/File';
import User from '../app/models/user';

const models = [User, File];

class DataBase {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}
export default new DataBase();
