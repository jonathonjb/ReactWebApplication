require('dotenv').config();
const express = require("express");
const path = require("path");
const pino = require('express-pino-logger')();
const mongoose = require("mongoose");
const passport = require('passport');

const auth = require('./auth');
const routes = require('./routes');

const app = express();
app.use(express.static(path.join(__dirname, "../../build")));
app.use(pino);

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });



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
const UserModel = mongoose.model("User", userSchema);
const ChatModel = mongoose.model("Chat", chatSchema);
const PollModel = mongoose.model("Polls", pollSchema);



auth.initialize(passport);
routes(app, UserModel, ChatModel, PollModel);

let serverPort = process.env.SERVER_PORT;
app.listen(serverPort, () => {
    console.log('server up and running at ' + serverPort);
});