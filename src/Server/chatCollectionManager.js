
const createChatInstance = async (Chat, name, message) => {
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

const readAllChatInstances = async (Chat) => {
    try{
        return await Chat.find({});
    }
    catch(error){
        return null;
    }
}

const deleteAllChatInstances = async (Chat) => {
    try{
        return await Chat.deleteMany({});
    }
    catch(error){
        return false;
    }
}

module.exports = {
    createChatInstance,
    readAllChatInstances,
    deleteAllChatInstances
}