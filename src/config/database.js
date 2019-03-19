require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const Sequelize = require('sequelize');

const { Op } = Sequelize;

module.exports = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT || 'postgres',
  storage: './__tests__/database.sqlite',
  operatorsAliases: {
    $and: Op.and,
    $or: Op.or,
    $eq: Op.eq,
    $gt: Op.gt,
    $lt: Op.lt,
    $lte: Op.lte,
    $like: Op.like,
  },
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
