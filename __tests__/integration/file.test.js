const fs = require('fs');
const request = require('supertest');
const path = require('path');
const server = require('../../src/server');
const FileService = require('../../src/app/services/FileService');
const FileController = require('../../src/app/controllers/FileController');
const LogService = require('../../src/app/services/LogService');

describe('File', () => {
  beforeEach(async () => {
    await FileService.destroy();
    await LogService.destroy();
  });

  it('should clear all file/database and show main', async () => {
    // const filePath = path.resolve(__dirname, '..', '..', 'src', 'public', 'games.log');
    const response = await request(server).get('/');

    // expect(response).toBeInstanceOf(Object);
    // await FileController.create();
    const uploads = path.resolve(__dirname, '..', '..', 'uploads');
    fs.readdir(uploads, (err, files) => {
      expect(files.length).toBe(0);
    });
    const logs = await LogService.index();
    expect(logs.length).toBe(0);
  });
});
