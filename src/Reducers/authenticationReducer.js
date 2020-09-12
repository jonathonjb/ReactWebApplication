const initialState = {
    loggedIn: false
}

export default (state=initialState, action) => {
    let newState = {...state};
    switch(action.type){
        case 'LOGIN':
            newState.loggedIn = true;
            return newState;
        case 'LOGOUT':
            newState.loggedIn = false;
            return newState
        default:
            return state;
    }
}