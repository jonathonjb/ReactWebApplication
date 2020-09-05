const mongoose = require("mongoose");

const pollSchema = mongoose.Schema({
    question: {type: String, required: true},
    choices: {type: [String], required: true},
    votes: {type: [Number], required: true},
    datePosted: {type: Date, default: Date.now}
});

const Poll = mongoose.model("Polls", pollSchema);

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const createPollInstance = async (question, choices) => {
    let votes = [];
    for(let i = 0; i < choices.length; i++){
        votes.push(0);
    }
    let instance = new Poll({
        question: question,
        choices: choices,
        votes: votes
    });
    try{
        return await instance.save();
    }
    catch(error){
        console.log("Problem with poll creation");
    }
}

const getPollInstace = async (id) => {
    console.log("ID: " + id);
    try{
        return await Poll.find({"_id": id});
    }
    catch(error){
        console.log("problem getting updated poll instance");
    }
}

const saveUpdatedPollInstance = async (updatedInstance) => {
    try{
        return await Poll.findByIdAndUpdate(updatedInstance._id, {"votes": updatedInstance.votes}, {new: true});
    }
    catch(error){
        console.log('problem saving updated poll instance')
    }
}

const getAllPollInstances = async () => {
    try{
        return await Poll.find({});
    }
    catch(error){
        console.log('problem retrieving poll instances');
    }
}

const deleteAllPollInstances = async () => {
    try{
        return await Poll.deleteMany({});
    }
    catch(error){
        console.log('problem deleting all poll instances');
    }
}

module.exports = {
    createPollInstance: createPollInstance,
    getAllPollInstances: getAllPollInstances,
    deleteAllPollInstances: deleteAllPollInstances,
    getPollInstace: getPollInstace,
    saveUpdatedPollInstance: saveUpdatedPollInstance
}