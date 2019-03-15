const { promisify } = require('util');
const path = require('path');
const { readFile, writeFile } = require('fs');

const FileService = require('../../src/app/services/FileService');

const readFilePromise = promisify(readFile);
const writeFilePromise = promisify(writeFile);

describe('File', () => {
  it('Should return SUCCESS to read file', async () => {
    const gamesLog = await readFilePromise(
      path.resolve(__dirname, '..', '..', 'src', 'public', 'games.log'),
      'utf-8',
    );
    await writeFilePromise(path.resolve(__dirname, '..', '..', 'uploads', 'games.log'), gamesLog);
    const file = await FileService.readFile('games.log');
    expect(typeof file).toBe('string');
  });

  it('Should return FAIL to read file', async () => {
    try {
      const file = await FileService.readFile('');
    } catch (err) {
      expect(err).toBeInstanceOf(Object);
      expect(err).toHaveProperty('msg');
    }
  });
});
