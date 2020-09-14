const initialState = {
    loggedIn: false,
    username: null
}

export default (state=initialState, action) => {
    let newState = {...state};
    switch(action.type){
        case 'LOGIN':
            newState.loggedIn = true;
            newState.username = action.username;
            return newState;
        case 'LOGOUT':
            newState.loggedIn = false;
            newState.username = null;
            return newState
        default:
            return state;
    }
}