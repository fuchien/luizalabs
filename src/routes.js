const express = require('express');

const multerConfig = require('./config/multer');
const upload = require('multer')(multerConfig);

// CONTROLLERS
const FileController = require('./app/controllers/FileController');
const LogsController = require('./app/controllers/LogsController');

const routes = express.Router();

routes.get('/', FileController.create);

// FILE
routes.post('/file', upload.single('file'), FileController.store);

// GAME LOG
routes.get('/logs', LogsController.index);
routes.get('/logs/:game_id', LogsController.show);

module.exports = routes;
