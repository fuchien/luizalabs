const express = require('express');

const multerConfig = require('./config/multer');
const upload = require('multer')(multerConfig);

// CONTROLLERS
const FileController = require('./app/controllers/FileController');

const routes = express.Router();

routes.get('/', FileController.create);

// FILE
routes.post('/file', upload.single('file'), FileController.store);

module.exports = routes;
