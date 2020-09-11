const { createChatInstance, readAllChatInstances, deleteAllChatInstances } = require("./chatCollectionManager");
const { createPollInstance, getAllPollInstances, deleteAllPollInstances, getPollInstace, saveUpdatedPollInstance } = require("./pollCollectionManager");
const { addUser, findUserFromUsername } = require("./userCollectionManager");
const { makeMove } = require("./Chess/chessAi");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const session = require('express-session');

const jsonParser = bodyParser.json();

module.exports = (app, passport, UserModel, ChatModel, PollModel) => {
    // authentication middleware
    function authenticate(req, res, next) {
        console.log('authenticate (middleware)');
        passport.authenticate('local', (err, user, info) => {
            if(err){
                next();
            }
            else if(!user){
                next();
            }
            req.login(user, next);
        })(req, res, next);
    }
    
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, "../../build", "index.html"));
    });

    app.post('/register', jsonParser, async (req, res) => {
        let data = req.body;
        let hashedPassword = await bcrypt.hash(data.password, 10);
        findUserFromUsername(UserModel, data.username).then(result => {
            if(result === null){
                addUser(UserModel, data.username, hashedPassword).then(additionResult => {
                    if(additionResult !== null){
                        res.send({'status': 'success'});
                    }
                    else{
                        res.send({'status': 'failure', 'message': 'Problem adding your account to the database.'});
                    }
                });
            }
            else{
                res.send({'status': 'failure', 'message': 'The username already exists.'});
            }
        });
    });

    app.post('/login', jsonParser, authenticate, (req, res) => {
        console.log('at post /login');
        if(req.isAuthenticated()){
            res.send(JSON.stringify({'status': 'success'}));
        }
        else{
            res.send(JSON.stringify({'status': 'failure'}));
        }
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