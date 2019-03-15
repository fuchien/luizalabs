const LogService = require('../services/LogService');

class LogsController {
  async index(req, res) {
    const logs = await LogService.index();
    return res.render('logs', { logs });
  }

  async show(req, res) {
    const game = await LogService.show(req.params.gameId);
    return res.send({ game });
  }
}

module.exports = new LogsController();
