const createPollInstance = async (Poll, question, choices) => {
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

const getPollInstace = async (Poll, id) => {
    console.log("ID: " + id);
    try{
        return await Poll.find({"_id": id});
    }
    catch(error){
        console.log("problem getting updated poll instance");
    }
}

const saveUpdatedPollInstance = async (Poll, updatedInstance) => {
    try{
        return await Poll.findByIdAndUpdate(updatedInstance._id, {"votes": updatedInstance.votes}, {new: true});
    }
    catch(error){
        console.log('problem saving updated poll instance')
    }
}

const getAllPollInstances = async (Poll) => {
    try{
        return await Poll.find({});
    }
    catch(error){
        console.log('problem retrieving poll instances');
    }
}

const deleteAllPollInstances = async (Poll) => {
    try{
        return await Poll.deleteMany({});
    }
    catch(error){
        console.log('problem deleting all poll instances');
    }
}

module.exports = {
    createPollInstance,
    getAllPollInstances,
    deleteAllPollInstances,
    getPollInstace,
    saveUpdatedPollInstance
}