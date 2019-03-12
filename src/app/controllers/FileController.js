const fs = require('fs');
const path = require('path');

class FileController {
  async create(req, res) {
    return res.render('main');
  }

  async store(req, res) {
    const { filename: file } = req.file;

    const filePath = fs.createReadStream(
      path.resolve(__dirname, '..', '..', '..', 'uploads', file),
    );
    const rl = require('readline').createInterface({
      input: filePath,
    });
    rl.on('line', (line) => {
      console.log(line);
    });

    return res.redirect('/');
  }
}

module.exports = new FileController();
