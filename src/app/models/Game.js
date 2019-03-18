module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    game_id: DataTypes.INTEGER,
    total_kills: DataTypes.INTEGER,
    players: DataTypes.STRING,
    kills: DataTypes.STRING,
  });

  return Game;
};
