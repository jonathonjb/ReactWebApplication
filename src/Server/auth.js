const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

const initialize = (passport) => {
    const authenticateUser = async (username, password, done) => {
        let user = getUserFromUsername(username);
        if(user === null){
            return done(null, false, {message: 'The user with that username does not exist in the database.'});
        }
        try{
            if(await bcrypt.compare(user.password, password)){
                return done(null, true);
            }
            else{
                return done(null, false, {message: 'The password is incorrect.'});
            }
        }
        catch {
            return done(null, false, {message: 'There was a problem logging you in.'})
        }
    }

    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => {
        return done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
        return done(null, getUserFromId(id));
    });
}

module.exports = {initialize};