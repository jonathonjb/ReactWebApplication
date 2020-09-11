const addUser = async (User, username, hashedPassword) => {
    let newUser = new User({
        username: username,
        password: hashedPassword
    });
    try{
        return await newUser.save();
    }
    catch{
        return false;
    }
}

const findUserFromUsername = async(User, username) => {
    try{
        return await User.findOne({username: username}).exec();
    }
    catch{
        return false
    }
}

const findUserFromId = async(User, id) => {
    try{
        return await User.findById(id);
    }
    catch{
        return false
    }
}


module.exports = {
    addUser,
    findUserFromUsername,
    findUserFromId
}