const { createChatInstance, readAllChatInstances, deleteAllChatInstances } = require("./chatDatabaseManager");
const { createPollInstance, getAllPollInstances, deleteAllPollInstances, getPollInstace, saveUpdatedPollInstance } = require("./pollDatabaseManager");
const { makeMove } = require("./Chess/chessAi");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const passport = require('passport');
const session = require('express-session');

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = (app, ChatModel, PollModel) => {
// authentication middleware
    function authenticate(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if(err){
                res.send(JSON.stringify({'status': 'failure', 'message': 'error with authentication process'}));
            }
            if(!user){
                res.send(JSON.stringify({'status': 'failure', 'message': 'user not found in the database'}));
            }
            else{
                res.send(JSON.stringify({'status': 'success'}));
            }
        })
    }
    
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, "../../build", "index.html"));
    });

    app.post('/register', jsonParser, (req, res) => {

    });

    app.post('/chat/message_submit', jsonParser, (req, res) => {
        let data = req.body;
        let obj = {
            "status": "failure"
        };

        if(createChatInstance(ChatModel, data.name, data.message)){
            obj.status = "success";
        }

        res.send(JSON.stringify(obj));
    });

    app.post('/chat/remove_all', (req, res) => {
        deleteAllChatInstances(ChatModel).then(data => {
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
        readAllChatInstances(ChatModel).then(data => {
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

        createPollInstance(PollModel, data.question, data.choices).then((status) => {
            if(status){
                res.send(JSON.stringify({"status": "success"}));
            }
            else{
                res.send(JSON.stringify({"status": "failure"}));
            }
        });
    });

    app.post('/polls/get_polls', (req, res) => {
        getAllPollInstances(PollModel).then((data) => {
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
        deleteAllPollInstances(PollModel).then((data) => {
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
        getPollInstace(PollModel, data.id).then(instance => {
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

        if(result === 'checkmated'){
            res.send(JSON.stringify({
                'checkmate': true
            }));
        }

        let positionOne = result[0];
        let positionTwo = result[1];
        let newState = result[2];

        res.send(JSON.stringify({
            'board': newState[0],
            'castlingCodes': newState[1],
            'enPassantPos': newState[2],
            'positionOne': positionOne,
            'positionTwo': positionTwo,
            'checkmate': false
        }));
    });
}