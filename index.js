'use strict';

require('dotenv').config();
const APIserver = require('./api-server/src/server.js');

const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/auth-api`

// Start up DB Server
const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
};


async function connect(next) {
    try {

        await mongoose.connect(MONGODB_URI, options)
        console.log("MONGODB COnnected");
        await APIserver.start(process.env.PORT);
    } catch (e) {
        console.error(e);
        next("CAN NOT CONNECT TO THE DB AND SERVER !")
    }
}

connect();