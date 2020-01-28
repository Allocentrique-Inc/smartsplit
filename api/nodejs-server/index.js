'use strict';


require('./utils/utils');

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
require("express-async-errors")
const router = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const VERSION = 'v1';

const app = express();

const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const serverPort = 8080;
const cors = require('cors');

// Connexion à la base de données
require("mongoose").connect(
	process.env["MONGODB_PATH"] || "mongodb://localhost/smartsplit",
	{useNewUrlParser: true, useUnifiedTopology: true}
)

// swaggerRouter configuration
let options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
let spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
let swaggerDoc = jsyaml.safeLoad(spec);

// bodyparser config
app.use(bodyParser.json({strict: false}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('short'));
app.use(express.static('./public'));
app.use(cors())

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Attrapage des erreurs
  app.use(function(err, req, res, next) {
    res
      .status(err.httpStatus || 500)
      .json(err.jsonError || {
        error: err.message
      })

    console.error(err)
  })

  try {
    // myroutine(); // may throw three types of exceptions
    http.createServer(app).listen(serverPort, function () {
      console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
      console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    });
  } catch (err) {
    if (err instanceof TypeError) {
      // statements to handle TypeError exceptions
      console.log("Recognized TypeError", err.message, err.fileName, err.lineNumber)

    } else if (err instanceof RangeError) {
      // statements to handle RangeError exceptions
      console.log("Recognized RangerError", err.message, err.fileName, err.lineNumber)

    } else if (err instanceof EvalError) {
      // statements to handle EvalError exceptions
      console.log("Recognized EvalError", err.message, err.fileName, err.lineNumber)

    } else {
      // statements to handle any unspecified exceptions
      logMyErrors(e); // pass exception object to error handler
    }
  }

});

module.exports = app; // for testing
