const LogService = require('../../src/app/services/LogService');

describe('File', () => {
  beforeEach(async () => {
    await LogService.destroy();
  });

  it('should save game log in database when function create called', async () => {
    const game = {
      game_id: 1,
      kills: '{}',
      players: '',
      total_kills: 0,
    };
    const logs = await LogService.create(game);
    expect(logs).toBeInstanceOf(Object);
  });

  it('should return FAIL when function create called', async () => {
    const game = {
      game_id: 1,
      kills: '{}',
      players: [],
      total_kills: 0,
    };
    try {
      const logs = await LogService.create(game);
    } catch (err) {
      expect(err).toBeInstanceOf(Object);
    }
  });

  it('should return an game object from database when function show called', async () => {
    const game = {
      game_id: 1,
      kills: '{}',
      players: '',
      total_kills: 0,
    };
    const logs = await LogService.create(game);
    const log = await LogService.show(game.game_id);
    expect(log).toBeInstanceOf(Object);
  });

  it('should return FAIL when function show called', async () => {
    const game = {
      game_id: 1,
      kills: '{}',
      players: '',
      total_kills: 0,
    };
    try {
      const logs = await LogService.create(game);
      const log = await LogService.show(2);
    } catch (err) {
      expect(err).toBeInstanceOf(Object);
    }
  });

  it('should return an array of game objects from database when function index called', async () => {
    const games = [
      {
        game_id: 1,
        kills: '{}',
        players: '',
        total_kills: 0,
      },
      {
        game_id: 2,
        kills: '{}',
        players: '',
        total_kills: 0,
      },
    ];
    const savedGames = await Promise.all(games.map(game => LogService.create(game)));
    const allGames = await LogService.index();
    expect(allGames.length).toEqual(2);
  });

  it('should destroy all data when function destroy called', async () => {
    const destroyed = await LogService.destroy();
    expect(destroyed).toEqual(0);
  });
});
