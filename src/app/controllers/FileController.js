const fs = require('fs');
const path = require('path');

class FileController {
  async create(req, res) {
    return res.render('main');
  }

  async store(req, res) {
    const { filename: file } = req.file;

    const filePath = path.resolve(__dirname, '..', '..', '..', 'uploads', file);
    const games = [];
    let gameId = 1;
    fs.readFile(filePath, 'utf-8', (err, data) => {
      data.split('\n').map((line, index) => {
        const person1Kills = 0;
        const person2Kills = 0;
        if (line.toLowerCase().includes('initgame')) {
          games.push({
            gameId,
            players: [],
            total_kills: 0,
            kills: {},
          });
          gameId++;
        } else if (line.toLowerCase().includes('kill')) {
          const killInfo = line.split(': ')[2];
          console.log(killInfo);
          const [, person1, person2] = /(.+) killed (.+) by/.exec(killInfo);
          const game = { ...games[gameId - 2] };
          game.total_kills += 1;
          game.players.push(person1, person2);
          if (person1 === '<world>' || person1 === person2) {
            game.kills[person2] = game.kills[person2] ? game.kills[person2] - 1 : person2Kills - 1;
            games[gameId - 2] = game;
            return;
          }
          game.kills[person1] = game.kills[person1] ? game.kills[person1] + 1 : person1Kills + 1;
          games[gameId - 2] = game;
        }
      });
      games.forEach((game, index) => {
        game.players = [...new Set(game.players.filter(player => player !== '<world>'))];
      });
      console.log(games);
      return res.redirect('/');
    });
  }
}

module.exports = new FileController();
