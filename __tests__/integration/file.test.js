const fs = require('fs');
const request = require('supertest');
const { promisify } = require('util');
const { readFile } = require('fs');

const readFilePromise = promisify(readFile);
const path = require('path');
const server = require('../../src/server');
const FileService = require('../../src/app/services/FileService');
const LogService = require('../../src/app/services/LogService');

describe('File', () => {
  beforeEach(async () => {
    await FileService.destroy();
    await LogService.destroy();
  });

  it('should save all file games log in database', async () => {
    const filePath = path.resolve(__dirname, '..', '..', 'src', 'public', 'games.log');
    const file = await readFilePromise(filePath, 'utf-8');
    const response = await request(server)
      .post('/file')
      .send(file);
    expect(response.status).toBe(200);
    LogService.index = jest.fn();
    LogService.index.mockImplementation(() => Promise.resolve(['', '']));
    FileService.handleFile = jest.fn();
    FileService.handleFile.mockImplementation(() => Promise.resolve(['', '']));
    const logs = await FileService.handleFile(file);
    expect(logs.length).toBe(2);
  });

  it('should clear all file/database', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    const uploads = path.resolve(__dirname, '..', '..', 'uploads');
    fs.readdir(uploads, (err, files) => {
      expect(files.length).toBe(0);
    });
  });
});
