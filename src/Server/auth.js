const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const initialize = (passport, UserCollection, getUserFromUsername, getUserFromId) => {
    const authenticateUser = async (username, password, done) => {
        let user = await getUserFromUsername(UserCollection, username);
        if(user === null){
            return done(null, false, {message: 'The user with that username does not exist in the database.'});
        }
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user);
            }
            else{
                return done(null, false, {message: 'Passwords do not match'});
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
    passport.deserializeUser(async (id, done) => {
        let user = await getUserFromId(UserCollection, id);
        return done(null, user);
    });
}

module.exports = {initialize};