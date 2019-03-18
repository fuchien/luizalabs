const { promisify } = require('util');
const path = require('path');
const { readdir, readFile, writeFile } = require('fs');

const FileService = require('../../src/app/services/FileService');
const LogService = require('../../src/app/services/LogService');

const readFilePromise = promisify(readFile);
const writeFilePromise = promisify(writeFile);
let readDirPromise = promisify(readdir);

describe('File', () => {
  it('Should return SUCCESS when call function readFile', async () => {
    const gamesLog = await readFilePromise(
      path.resolve(__dirname, '..', '..', 'src', 'public', 'games.log'),
      'utf-8',
    );
    await writeFilePromise(path.resolve(__dirname, '..', '..', 'uploads', 'games.log'), gamesLog);
    const file = await FileService.readFile('games.log');
    expect(typeof file).toBe('string');
  });

  it('Should return FAIL when call function readFile', async () => {
    try {
      const file = await FileService.readFile('');
    } catch (err) {
      expect(err).toBeInstanceOf(Object);
      expect(err).toHaveProperty('msg');
    }
  });

  it('Should return GAME object when call function handleInitGame', () => {
    const line = '  0:00 InitGame:';
    const game_id = 1;
    expect(FileService.handleInitGame({ line, game_id })).toBeInstanceOf(Object);
    expect(FileService.handleInitGame({ line, game_id })).toHaveProperty('players');
    expect(FileService.handleInitGame({ line, game_id })).toHaveProperty('kills');
    expect(FileService.handleInitGame({ line, game_id })).toHaveProperty('total_kills');
    expect(FileService.handleInitGame({ line, game_id })).toHaveProperty('game_id');
  });

  it('Should return undefined when call function handleInitGame', () => {
    const line = '  0:00 :';
    expect(FileService.handleInitGame({ line })).toBeUndefined();
  });

  it('Should return LINES array to getLines', () => {
    const data = `0:00 InitGame:
    asdasd`;
    expect(FileService.getLines(data)).toBeInstanceOf(Array);
    expect(FileService.getLines(data).length).toBe(2);
  });

  it('Should return GAMES array with UNIQUE players when call function handleDuplicatedPlayers', () => {
    const games = [
      {
        players: ['Zeh', 'Dono da Bola', 'Dono da Bola', '<world>'],
      },
      {
        players: ['Zeh', 'Isgalamido', 'Dono da Bola', 'Isgalamido', 'Dono da Bola', '<world>'],
      },
    ];
    expect(FileService.handleDuplicatedPlayers(games)).toBeInstanceOf(Array);
    expect(FileService.handleDuplicatedPlayers(games)[0].players.length).toBe(2);
    expect(FileService.handleDuplicatedPlayers(games)[1].players.length).toBe(3);
  });

  it('Should return undefined when call function handleKills', () => {
    const line = '0:00 InitGame:';
    expect(FileService.handleKills({ line })).toBeUndefined();
  });

  it('Should return an GAME object with <world> player when call function handleKills', () => {
    const line = ' 20:54 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT';
    const game_id = 3;
    const games = [
      {
        game_id: 1,
        kills: {},
        players: [],
        total_kills: 0,
      },
      {
        game_id: 2,
        kills: {},
        players: [],
        total_kills: 0,
      },
    ];
    expect(FileService.handleKills({ line, game_id, games })).toBeInstanceOf(Object);
    expect(FileService.handleKills({ line, game_id, games })).toHaveProperty('game_id');
    expect(FileService.handleKills({ line, game_id, games })).toHaveProperty('kills');
    expect(FileService.handleKills({ line, game_id, games })).toHaveProperty('players');
    expect(FileService.handleKills({ line, game_id, games })).toHaveProperty('total_kills');
    expect(FileService.handleKills({ line, game_id, games }).game_id).toBe(2);
    expect(FileService.handleKills({ line, game_id, games }).kills).toBeInstanceOf(Object);
    expect(FileService.handleKills({ line, game_id, games }).total_kills).toBe(1);
    expect(FileService.handleKills({ line, game_id, games }).players).toBeInstanceOf(Object);
  });

  it('Should return an GAME object without <world> player when call function handleKills', () => {
    const line = ' 22:06 Kill: 2 3 7: Isgalamido killed Mocinha by MOD_ROCKET_SPLASH';
    const game_id = 3;
    const games = [
      {
        game_id: 1,
        kills: {},
        players: [],
        total_kills: 0,
      },
      {
        game_id: 2,
        kills: {},
        players: [],
        total_kills: 0,
      },
    ];
    expect(FileService.handleKills({ line, game_id, games })).toBeInstanceOf(Object);
    expect(FileService.handleKills({ line, game_id, games })).toHaveProperty('game_id');
    expect(FileService.handleKills({ line, game_id, games })).toHaveProperty('kills');
    expect(FileService.handleKills({ line, game_id, games })).toHaveProperty('players');
    expect(FileService.handleKills({ line, game_id, games })).toHaveProperty('total_kills');
    expect(FileService.handleKills({ line, game_id, games }).game_id).toBe(2);
    expect(FileService.handleKills({ line, game_id, games }).kills).toBeInstanceOf(Object);
    expect(FileService.handleKills({ line, game_id, games }).total_kills).toBe(1);
    expect(FileService.handleKills({ line, game_id, games }).players).toBeInstanceOf(Object);
  });

  it('Should return SAVEDGAME an array of object when call function handleGames', async () => {
    const lines = [
      ' 20:37 InitGame:',
      ' 20:54 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT',
      ' 21:07 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT',
    ];
    FileService.saveGames = jest.fn();
    FileService.saveGames.mockImplementation(() => Promise.resolve([{}]));
    const savedGames = await FileService.handleGames(lines);
    expect(savedGames).toBeInstanceOf(Object);
    expect(savedGames.length).toBe(1);
  });

  it('Should return SAVEDGAME an array of object when call function saveGames', async () => {
    const games = [
      {
        game_id: 1,
        kills: {},
        players: [],
        total_kills: 0,
      },
    ];
    LogService.create = jest.fn();
    LogService.create.mockImplementation(() => Promise.resolve([{}]));
    const savedGames = await FileService.saveGames(games);
    expect(savedGames).toBeInstanceOf(Object);
    expect(savedGames.length).toBe(1);
  });

  it('Should return GAME an array of object when call function handleFile', async () => {
    const file = `
    ' 20:37 InitGame:',
    ' 20:54 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT',
    ' 21:07 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT',
    `;
    FileService.readFile = jest.fn();
    FileService.getLines = jest.fn();
    FileService.handleGames = jest.fn();
    FileService.readFile.mockImplementation(() => Promise.resolve(''));
    FileService.getLines.mockImplementation(() => Promise.resolve(['']));
    FileService.handleGames.mockImplementation(() => Promise.resolve([
      {
        game_id: 1,
        kills: {},
        players: [],
        total_kills: 0,
      },
    ]));
    const games = await FileService.handleFile(file);
    expect(games).toBeInstanceOf(Object);
    expect(games.length).toBe(1);
  });

  it('Should destroy all uploads folder files', () => {
    readDirPromise = jest.fn();
    readDirPromise.mockImplementation(() => ['']);
    expect(FileService.destroy()).toBeInstanceOf(Object);
  });
});
