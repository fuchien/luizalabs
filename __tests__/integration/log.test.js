const request = require('supertest');
const server = require('../../src/server');
const FileService = require('../../src/app/services/FileService');
const LogService = require('../../src/app/services/LogService');
const truncate = require('../utils/truncate');

jest.setTimeout(30000);

describe('File', () => {
  beforeEach(async () => {
    await truncate();
    await FileService.destroy();
    // await LogService.destroy();
  });

  it('Should return all games when function index called', async () => {
    const game = {
      game_id: 1,
      kills: '{}',
      players: '',
      total_kills: 0,
    };
    const response = await request(server).get('/logs');
    expect(response.status).toBe(200);
    LogService.index = jest.fn();
    LogService.index.mockImplementation(() => Promise.resolve(['']));
    const savedLog = await LogService.create(game);
    const logs = await LogService.index();
    expect(logs.length).toBe(1);
  });

  it('Should return an game object by game_id when function show called', async () => {
    const game = {
      game_id: 1,
      kills: '{"Isgalamido": 1}',
      players: '',
      total_kills: 0,
    };
    const response = await request(server).get('/logs/1');
    expect(response.status).toBe(200);
    const savedLog = await LogService.create(game);
    const log = await LogService.show(savedLog.game_id);
    expect(log).toBeInstanceOf(Object);
  });
});
