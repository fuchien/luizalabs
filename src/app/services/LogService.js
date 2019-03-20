const { Game } = require('../models');

class LogService {
  create(log) {
    return new Promise(async (resolve, reject) => {
      try {
        const logCreated = await Game.create({ ...log });
        resolve(logCreated);
      } catch (err) {
        reject({
          msg: 'Error to create',
          err,
        });
      }
    });
  }

  async show(game_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const game = await Game.findOne({ where: { game_id } });
        if (game) {
          // return kills object and player array
          game.kills ? (game.kills = JSON.parse(game.kills)) : game.kills;
          game.players ? (game.players = game.players.split(',')) : game.players;
        }
        resolve(game);
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
        const games = await Game.findAll({
          where: {},
          order: [['game_id']],
        });
        games.forEach((game) => {
          // return kills object and player array
          game.kills = JSON.parse(game.kills);
          game.players = game.players.split(',');
        });
        resolve(games);
      } catch (err) {
        reject({
          msg: 'Error to get all game',
          err,
        });
      }
    });
  }

  async destroy() {
    return new Promise(async (resolve, reject) => {
      try {
        const destroyed = await Game.destroy({
          where: {},
          truncate: true,
        });
        resolve(destroyed);
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
