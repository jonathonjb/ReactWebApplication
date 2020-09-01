const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
    name: {type: String, required: true},
    message: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

const Chat = mongoose.model("Chat", chatSchema);

const mongoUri = "mongodb+srv://jonathonjb2015:mongodatabasepasswordsilvermacbrowntable@cluster0.jbwx0.mongodb.net/cluster0?retryWrites=true&w=majority";
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });


const createChatInstance = async (name, message) => {
    let instance = new Chat({
        name: name,
        message: message
    });

    try{
        await instance.save(); // THIS WILL ALWAYS RETURN TRUE; FIX THIS SO IT ONLY RETURNS TRUE IF CREATION SUCCEEDS
        return true;
    }
    catch(error){
        return false;
    }
}

const readAllChatInstances = async () => {
    try{
        return await Chat.find({});
    }
    catch(error){
        return null;
    }
}

const deleteAllChatInstances = async () => {
    console.log("\n\nHERE\n\n");
    try{
        return await Chat.deleteMany({});
    }
    catch(error){
        return false;
    }
}

const updateChatInstance = (instance) => {
    // TODO figure out what to search for (id, name, etc...) and finish this function
}

const deleteChatInstance = (id) => {
    // TODO figure out what to search for (id, name, etc...) and finish this function
}

module.exports = {
    createChatInstance: createChatInstance,
    readAllChatInstances: readAllChatInstances,
    deleteAllChatInstances: deleteAllChatInstances
}