'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');

const authRoutes = require('../../auth-server/src/auth/routes.js');
const v1Routes = require('./routes/v1.js');
const v2Routes = require('./routes/v2.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);


app.use(morgan('dev'));

// Routes
app.use(authRoutes);
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);



app.use(errorHandler);
app.use('*', notFoundHandler);


module.exports = {
    server: app,
    start: port => {
        if (!port) { throw new Error("Missing Port"); }
        app.listen(port, () => console.log(`Listening on ${port}`));
    },
};