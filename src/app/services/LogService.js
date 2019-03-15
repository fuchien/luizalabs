const Log = require('../models/Log');

class LogService {
  create(log) {
    return new Promise(async (resolve, reject) => {
      try {
        const logCreated = await Log.create({ ...log });
        resolve(logCreated);
      } catch (err) {
        reject({
          msg: 'Error to create',
          err,
        });
      }
    });
  }

  async show(gameId) {
    return new Promise(async (resolve, reject) => {
      try {
        const log = await Log.findOne({ gameId });
        resolve(log);
      } catch (err) {
        reject({
          msg: 'Error to show game by id',
          err,
        });
      }
    });
  }

  async index() {
    return new Promise(async (resolve, reject) => {
      try {
        const logs = await Log.find({}, null, {
          sort: {
            _id: 'asc',
          },
        });
        resolve(logs);
      } catch (err) {
        reject({
          msg: 'Error to get all game log',
          err,
        });
      }
    });
  }

  async destroy() {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await Log.deleteMany());
      } catch (err) {
        reject({
          msg: 'Error to destroy all document',
          err,
        });
      }
    });
  }
}

module.exports = new LogService();
