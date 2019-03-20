const LogService = require('../services/LogService');
const FileService = require('../services/FileService');
const truncate = require('../../../__tests__/utils/truncate');

class FileController {
  async create(req, res) {
    truncate();
    FileService.destroy();
    // LogService.destroy();
    return res.render('main');
  }

  async store(req, res) {
    try {
      if (!req.file) {
        return res.render('main', { msg: 'Selecione um arquivo' });
      }
      const { filename: file } = req.file;
      await FileService.handleFile(file);
      return res.redirect('/logs');
    } catch (err) {
      console.log('ERRROR ', err);
      return res.render('main', { msg: 'Erro ao manipular o arquivo, tente novamente' });
    }
  }
}

module.exports = new FileController();
