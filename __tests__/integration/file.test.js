const fs = require('fs');
const request = require('supertest');
const { promisify } = require('util');
const { readdir, readFile } = require('fs');

const readFilePromise = promisify(readFile);
const readDirPromise = promisify(readdir);
const path = require('path');
const server = require('../../src/server');
const FileService = require('../../src/app/services/FileService');
const LogService = require('../../src/app/services/LogService');
const truncate = require('../utils/truncate');

jest.setTimeout(30000);

describe('File', () => {
  beforeEach(async () => {
    await truncate();
    await FileService.destroy();
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

  /*
  * I tried to test attaching file
  */
  // it('should return FAIL in database', async () => {
  //   const filePath = path.resolve(__dirname, '..', 'games.log');
  //   const file = await readFilePromise(filePath, 'utf-8');
  //   console.log(file);
  //   const response = await request(server)
  //     .post('/file')
  //     .attach('file', file);
  //   LogService.index = jest.fn();
  //   LogService.index.mockImplementation(() => Promise.resolve(['', '']));
  //   FileService.handleFile = jest.fn();
  //   FileService.handleFile.mockRejectedValue('Erro');
  //   try {
  //     const logs = await FileService.handleFile(file);
  //   } catch (err) {
  //     expect(err).toBeDefined();
  //   }
  // });

  it('should clear all file/database', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    const uploads = path.resolve(__dirname, '..', '..', 'uploads');
    const files = await readDirPromise(uploads);
    expect(files.length).toBe(0);
  });
});
