const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const pino = require('express-pino-logger')();
const { createChatInstance, readAllChatInstances, deleteAllChatInstances } = require("./chatDatabaseManager");
const { createPollInstance, getAllPollInstances, deleteAllPollInstances, getPollInstace, saveUpdatedPollInstance } = require("./pollDatabaseManager");
const { makeMove } = require("./Chess/chessAi");

const app = express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

//------------------------------------------------------------------------------------------------------------------------

app.use(express.static(path.join(__dirname, "build")));
app.use(pino);
   
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});


app.post('/chat/message_submit', jsonParser, (req, res) => {
    let data = req.body;
    let obj = {
        "status": "failure"
    };

    if(createChatInstance(data.name, data.message)){
        obj.status = "success";
    }

    res.send(JSON.stringify(obj));
});

app.post('/chat/remove_all', (req, res) => {
    deleteAllChatInstances().then(data => {
        if(data === false){
            res.send(JSON.stringify({
                "status": "failure"
            }));
        }
        res.send(JSON.stringify({
            "status": "success"
        }));
    })
})

app.post('/chat/get_messages', (req, res) => {
    readAllChatInstances().then(data => {
        if(data == null){
            res.send(JSON.stringify({
                "status": "failure"
            }));
        }
        res.send(JSON.stringify({
            "status": "success",
            "data": data
        }));
    });
});

app.post('/polls/create_poll', jsonParser, (req, res) => {
    let data = req.body;

    createPollInstance(data.question, data.choices).then((status) => {
        if(status){
            res.send(JSON.stringify({"status": "success"}));
        }
        else{
            res.send(JSON.stringify({"status": "failure"}));
        }
    });
});

app.post('/polls/get_polls', (req, res) => {
    getAllPollInstances().then((data) => {
        if(data == null){
            res.send(JSON.stringify({"status": "failure"}));
        }
        else{
            res.send(JSON.stringify({
                "status": "success",
                "data": data
            }));
        }
    });
});

app.post('/polls/delete_polls', (req, res) => {
    deleteAllPollInstances().then((data) => {
        if(data){
            res.send(JSON.stringify({
                "status": "success"
            }));
        }
        else{
            res.send(JSON.stringify({
                "status": "failure"
            }));
        }
    });
});

app.post('/polls/submit', jsonParser, (req, res) => {
    let data = req.body;
    getPollInstace(data.id).then(instance => {
        instance = instance[0];

        for(let i = 0; i < instance.choices.length; i++){
            if(instance.choices[i] == data.choice){
                instance.votes[i] += 1;
                break;
            }
        }
        if(instance === null){
            res.send(JSON.stringify({"status": "failure"}));
        }
        saveUpdatedPollInstance(instance).then(data => {
            if(data === null){
                res.send(JSON.stringify({"status": "failure"}));
            }
            res.send(JSON.stringify({"status": "success", "data": data}));
        });
    });
});

app.post('/chess/send', jsonParser, (req, res) => {
    let data = req.body;
    let board = data.board;
    let color = data.aiColor;
    let castlingCodes = data.castlingCodes;
    let enPassantPos = data.enPassantPos;

    let result = makeMove(color, board, castlingCodes, enPassantPos);

    let positionOne = result[0];
    let positionTwo = result[1];
    let newState = result[2];

    res.send(JSON.stringify({
        'board': newState[0],
        'castlingCodes': newState[1],
        'enPassantPos': newState[2],
        'positionOne': positionOne,
        'positionTwo': positionTwo
    }));
});









app.listen(3001);
console.log("\nNode.js server is up and running at PORT: 3001");