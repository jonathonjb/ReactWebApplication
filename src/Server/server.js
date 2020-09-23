require('dotenv').config();
const express = require("express");
const basicPino = require('pino');
const basicPinoLogger = basicPino({prettyPrint: true})
const expressPino = require('express-pino-logger')({
    logger: basicPinoLogger
});
const mongoose = require("mongoose");
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');

const auth = require('./auth');
const routes = require('./routes');
const { findUserFromUsername, findUserFromId } = require('./userCollectionManager');

const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(__dirname + "/../../build"));
app.use(expressPino);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true} // only stores the hashed passwords in plaintext, not the original passwords
});
const chatSchema = mongoose.Schema({
    name: {type: String, required: true},
    message: {type: String, required: true},
    date: {type: Date, default: Date.now}
});
const pollSchema = mongoose.Schema({
    question: {type: String, required: true},
    choices: {type: [String], required: true},
    votes: {type: [Number], required: true},
    datePosted: {type: Date, default: Date.now}
});
const UserCollection = mongoose.model("User", userSchema);
const ChatCollection = mongoose.model("Chat", chatSchema);
const PollCollection = mongoose.model("Polls", pollSchema);


auth.initialize(passport, UserCollection, findUserFromUsername, findUserFromId);
routes(app, passport, UserCollection, ChatCollection, PollCollection);

let serverPort = process.env.SERVER_PORT;
app.listen(serverPort | 8000, () => {
    console.log('server up and running at ' + serverPort);
});