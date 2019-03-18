const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { readdir, readFile } = require('fs');
const LogService = require('../services/LogService');

const readFilePromise = promisify(readFile);
const readDirPromise = promisify(readdir);

class FileService {
  async destroy() {
    const uploads = path.resolve(__dirname, '..', '..', '..', 'uploads');
    const files = await readDirPromise(uploads);
    if (files.length) {
      files.map(file => fs.unlink(`${uploads}/${file}`, (err) => {}));
    }
  }

  async handleFile(file) {
    const data = await this.readFile(file);
    const lines = this.getLines(data);
    const games = await this.handleGames(lines);
    return games;
  }

  async readFile(file) {
    return new Promise(async (resolve, reject) => {
      const filePath = path.resolve(__dirname, '..', '..', '..', 'uploads', file);

      try {
        const file = await readFilePromise(filePath, 'utf-8');
        resolve(file);
      } catch (err) {
        reject({
          msg: 'Error to read file',
          err,
        });
      }
    });
  }

  async handleGames(lines) {
    const games = [];
    let game_id = 1;
    lines.forEach((line) => {
      const initGame = this.handleInitGame({ line, game_id });
      if (initGame) {
        games.push(initGame);
        game_id++;
      }
      const gameKills = this.handleKills({ line, games, game_id });
      if (gameKills) {
        games[game_id - 2] = gameKills;
      }
    });
    const uniquePlayersGames = this.handleDuplicatedPlayers(games);
    uniquePlayersGames.forEach((game) => {
      game.kills = JSON.stringify(game.kills);
      game.players = game.players.join(',');
    });
    const savedGames = await this.saveGames(uniquePlayersGames);
    return savedGames;
  }

  handleKills({ line, games, game_id }) {
    if (!line.toLowerCase().includes('kill')) {
      return;
    }
    const person1Kills = 0;
    const person2Kills = 0;
    const killInfo = line.split(': ')[2];
    const [, person1, person2] = /(.+) killed (.+) by/.exec(killInfo);
    const game = { ...games[game_id - 2] };
    game.total_kills += 1;
    game.players.push(person1, person2);
    if (person1 === '<world>' || person1 === person2) {
      game.kills[person2] = game.kills[person2] ? game.kills[person2] - 1 : person2Kills - 1;
    } else {
      game.kills[person1] = game.kills[person1] ? game.kills[person1] + 1 : person1Kills + 1;
    }
    return game;
  }

  handleInitGame({ line, game_id }) {
    if (!line.toLowerCase().includes('initgame')) {
      return;
    }
    return {
      game_id,
      players: [],
      total_kills: 0,
      kills: {},
    };
  }

  handleDuplicatedPlayers(games) {
    const newGames = [...games];
    newGames.forEach(
      game => (game.players = [...new Set(game.players.filter(player => player !== '<world>'))]),
    );
    return newGames;
  }

  async saveGames(games) {
    return await Promise.all(games.map(async game => await LogService.create(game)));
  }

  getLines(data) {
    const lines = [];
    data.split('\n').map(line => lines.push(line));
    return lines;
  }
}

module.exports = new FileService();
