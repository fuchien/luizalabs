module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('games', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    game_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    total_kills: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    players: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    kills: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('games'),
};
