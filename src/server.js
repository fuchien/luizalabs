const express = require('express');

class App {
  constructor() {
    this.express = express();

    this.middlewares();
    this.views();
    this.routes();
  }

  middlewares() {}

  views() {}

  routes() {}
}

module.exports = new App().express;
